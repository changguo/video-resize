const videoResize = (function() {
  class Env {
    constructor() {
      this.videos = [];
    }
  }

  class Video {
    constructor(args) {
      this.name = args.element;
      this.element = document.querySelector(args.element);
      this.currentClass = '';
      this.container = this.element.parentElement;
      this.sources = inputDefaultVal(args.sources, false);
      this.loop = inputDefaultVal(args.loop, false);
      this.autoplay = inputDefaultVal(args.autoplay, false);
      this.muted = inputDefaultVal(args.mute, false);
      this.poster = inputDefaultVal(args.poster, false);
      this.mobilePoster = inputDefaultVal(args.mobilePoster, false);
      this.scale = inputDefaultVal(args.scale, 1);
      this.alignment = alignmentVal(args.align);
      this.fit = inputDefaultVal(args.fit, 'cover');
      this.mobileBreak = inputDefaultVal(args.mobileBreak, 1024);
      this.updateStyles();
      env.videos.push(this);
      this.index = env.videos.length - 1;
      this.active = false;
    }

    updateStyles() {
      const styles = createStyleSheet();
      createScaleCSS(styles, this.name, this.scale * 100);
      createAlignCSS(styles, this.name, this.alignment);
    }

    update() {
      this.updateStyles();
      this.resize();
    }

    resize() {
      checkVideoSize(this, this.element, this.container.clientWidth, this.container.clientHeight, this.ratio, this.fit);
    };

    init() {
      if (!this.active) {
        setVideoOnLoad(this, this.element, this.container, this.fit, this.mobileBreak, this.sources, this.name);
        onResize(this.index);
        this.active = true;
      } else {
        throw new Error('Video already initialized.');
      }
    }
  }

  /*
    Data validation
  */
  function inputDefaultVal(val, def) {
    return !val ? def: val;
  }
  function alignmentVal(alignment) {
    if (!alignment) {
      alignment = {x: 0.5, y: 0.5};
    } else if (!alignment.x) {
      alignment.x = 0;
    } else if (!alignment.y) {
      alignment.y = 0;
    }
    return alignment;
  }

  /*
    Styles
  */
  function createStyleSheet() {
    return document.head.appendChild(document.createElement("style"));
  }

  function createAlignCSS(styles, name, alignment) {
    let ap = {
      x: decimalToPercent(alignment.x),
      y: decimalToPercent(alignment.y)
    };
    styles.sheet.insertRule(name +
      ' { -webkit-transform: translate(-' + ap.x + '%, -' + ap.y + '%);' +
      ' -moz-transform: translate(-' + ap.x + '%, -' + ap.y + '%);' +
      ' -ms-transform: translate(-' + ap.x + '%, -' + ap.y + '%);' +
      ' -o-transform: translate(-' + ap.x + '%, -' + ap.y + '%);' +
      ' transform: translate(-' + ap.x + '%, -' + ap.y + '%);' +
      ' top: ' + ap.y + '%;' +
      ' left: ' + ap.x + '%; }', 0);
  }

  function createScaleCSS(styles, name, scale) {
    styles.sheet.insertRule(name + '.hrh { height: ' + scale + '%; }', 0);
    styles.sheet.insertRule(name + '.hrw { width: ' + scale + '%; }', 0);
    styles.sheet.insertRule(name + '.vrh { height: ' + scale + '%; }', 0);
    styles.sheet.insertRule(name + '.vrw { width: ' + scale + '%; }', 0);
  }

  /*
    Other
  */
  function setVideoOnLoad(video, element, container, fit, mobileBreak, sources, name) {
    if (!checkIfMobile(mobileBreak)) {
      let videoElement = createBaseNode('video', video, element, sources);
      video.element = videoElement; // Update element object
      element = videoElement;
      video.element.muted = video.muted;
      if (element.readyState === 0) { // If video metadata not loaded, listen for load.
        element.addEventListener( "loadedmetadata", function (e) {
          videoLoaded(video, element, container, fit, name);
        });
      } else if (element.readyState >= 1) { // Else, check if already loaded.
        videoLoaded(video, element, container, fit, name);
      }
    } else { // If on mobile, delete <video> node and create <img>
      let imageElement = createBaseNode('img', video, element, sources);
      video.element = imageElement; // Update element object
      imageElement.onload = function() { // Prevents clientWidth/Height returning 0
        videoLoaded(video, imageElement, container, fit, name);
      };
    }
  }

  function checkIfMobile(mobileBreak) {
    return window.innerWidth <= mobileBreak ? true: false;
  }

  function createBaseNode(nodeType, video, element, sources) {
    return nodeType == 'video'
      ? createVideoNode(video, element, sources)
      : createImgNode(video, element, sources);
  }

  function createVideoNode(video, element, sources) {
    let videoNode = document.createElement('video');
    videoNode.style.opacity = 0;
    videoNode.setAttribute('id', video.name.substring(1));
    if (video.loop) videoNode.setAttribute('loop', true);
    videoNode.setAttribute('poster', video.poster);
    if (video.autoplay) videoNode.setAttribute('autoplay', true);
    replacePlaceholderDiv(element, videoNode, video.container);
    activateVideo(video, videoNode, sources);
    return videoNode;
  }

  function activateVideo(video, element, sources) {
    if (Array.isArray(sources)) { // Check if multiple sources entered
      for (let s = 0; s < sources.length; s += 1) {
        createSourceNode(element, sources[s]);
      }
    } else {
      createSourceNode(element, sources);
    }
  }

  function createSourceNode(element, source) {
    let sourceNode = document.createElement('source');
    let sourceType = getFileExtension(source);
    let sourceTypeVal = sourceType === 'ogv' ? 'ogg': sourceType; // Check if .ogv, which needs type="video/ogg"
    sourceNode.setAttribute('src', source);
    sourceNode.setAttribute('type', 'video/' + sourceTypeVal);
    element.appendChild(sourceNode);
  }

  function getFileExtension(file) {
    let fileSplit = file.split('.');
    return fileSplit[fileSplit.length - 1];
  }

  function videoLoaded(video, element, container, fit, name) {
    element.style.position = 'absolute';
    removeElWidthHeight(element);
    video.ratio = getVideoRatio(element, video);
    checkVideoSize(video, element, container.clientWidth, container.clientHeight, video.ratio, fit);
    toggleOpacity(element);
  }

  function removeElWidthHeight(el) {
    el.style.width = '';
    el.style.height = '';
  }

  function replacePlaceholderDiv(oldEl, newEl, container) {
    container.appendChild(newEl);
    container.removeChild(oldEl);
  }

  function checkVideoSize(video, element, containerWidth, containerHeight, ratio, fit) {
    containerWidth >= containerHeight
      ? changeVideoSize(video, element, 'hr', containerWidth, containerHeight, ratio, fit)
      : changeVideoSize(video, element, 'vr', containerWidth, containerHeight, ratio, fit);
  }

  function changeVideoSize(video, element, prefix, containerWidth, containerHeight, ratio, fit) {
    if ((containerWidth > containerHeight && fit === 'height')
      || (containerWidth / ratio <= containerHeight && fit === 'cover')) {
      clearClass(element);
      element.classList.add(prefix + 'h');
      video.currentClass = prefix + 'h';
    } else {
      clearClass(element);
      element.classList.add(prefix + 'w');
      video.currentClass = prefix + 'w';
    }
  }

  function createImgNode(video, element, container) {
    if (!video.sources) { // If <source>/s exist, delete them
      deleteVideosSources(element);
    }
    let imageNode = document.createElement('img');
    imageNode.style.opacity = 0;
    imageNode.setAttribute('src', video.mobilePoster !== false ? video.mobilePoster: video.poster);
    imageNode.setAttribute('id', video.name.substring(1)); // substring to remove #
    replacePlaceholderDiv(element, imageNode, video.container);
    return imageNode;
  }

  function deleteVideosSources(element) {
    let sources = element.querySelectorAll('source');
    for (let s = 0; s < sources.length; s += 1) {
      element.removeChild(sources[s]);
      element.load(); // forces browser to abadon buffering?
    }
  }

  /*
    Helpers
  */
  function calcRatio(width, height) {
    return width / height;
  }
  function clearClass(el) {
    return el.className = "";
  }
  function decimalToPercent(num) {
    return num * 100;
  }
  function getVideoRatio(el) {
    return calcRatio(el.clientWidth, el.clientHeight);
  }
  function onResize(index) {
    window.onresize = () => env.videos[index].resize();
  }
  function toggleOpacity(el) {
    return el.style.opacity = el.style.opacity == 0 ? 1: 0;
  }

  /*
    Init
  */
  function newVideo(args) {
    return new Video(args);
  }
  const env = new Env();

  return {
    video: newVideo
  }
})();

const vr = (function() {
  function newVideo(args) {
    return videoResize.video(args);
  }
  return {
    video: newVideo
  }
})();
