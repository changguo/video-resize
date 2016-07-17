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
      this.container = this.element.parentElement;
      this.sources = inputDefaultVal(args.sources, false);
      this.loop = inputDefaultVal(args.loop, false);
      this.autoplay = inputDefaultVal(args.autoplay, false);
      this.muted = inputDefaultVal(args.mute, false);
      this.poster = inputDefaultVal(args.poster, false);
      this.currentClass = '';
      this.scale = inputDefaultVal(args.scale, 1);
      this.alignment = alignmentVal(args.align);
      this.fit = inputDefaultVal(args.fit, 'cover');
      this.mobileBreak = inputDefaultVal(args.mobileBreak, 1024);
      this.updateStyles();
      env.videos.push(this);
      this.index = env.videos.length - 1;
      this.active = false
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
        this.update();
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
    let alignmentPercent = {
      x: decToPer(alignment.x),
      y: decToPer(alignment.y)
    };
    styles.sheet.insertRule(name +
      ' { -webkit-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -moz-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -ms-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -o-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' top: ' + alignmentPercent.y + '%;' +
      ' left: ' + alignmentPercent.x + '%; }', 0);
  }

  function createScaleCSS(styles, name, scale) {
    styles.sheet.insertRule(name + '.hrh { height: ' + scale + '%; }', 0);
    styles.sheet.insertRule(name + '.hrw { width: ' + scale + '%; }', 0);
    styles.sheet.insertRule(name + '.vrh { height: ' + scale + '%; }', 0);
    styles.sheet.insertRule(name + '.vrw { width: ' + scale + '%; }', 0);
  }

  /*
    Video on-load
  */

  function setVideoOnLoad(video, element, container, fit, mobileBreak, sources, name) {
    if (!checkIfMobile(mobileBreak)) {
      let videoElement = createBaseNode('video', video, element, sources);
      video.element = videoElement; // Update element object
      element = videoElement;
      video.element.muted = video.muted;
      // If video metadata not loaded, listen for load.
      // Else, check if already loaded.
      if (element.readyState === 0) {
        element.addEventListener( "loadedmetadata", function (e) {
          videoLoaded(video, element, container, fit, name);
        });
      } else if (element.readyState >= 1) {
        videoLoaded(video, element, container, fit, name);
      }
    } else {
      // If on mobile, delete <video> node and create <img>
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
    let videoNode = createNode('video');
    videoNode.setAttribute('id', video.name.substring(1));
    videoNode.setAttribute('autoplay', video.autoplay);
    videoNode.setAttribute('loop', video.loop);
    replacePlaceholderDiv(element, videoNode, video.container);
    activateVideo(video, videoNode, sources);
    return videoNode;
  }

  function activateVideo(video, element, sources) {
    // Check if multiple sources entered
    if (Array.isArray(sources)) {
      for (let s = 0; s < sources.length; s += 1) {
        createSourceNode(element, sources[s]);
      }
    } else {
      createSourceNode(element, sources);
    }
  }

  function createSourceNode(element, source) {
    let sourceNode = createNode('source');
    sourceNode.setAttribute('src', source);
    let sourceType = getFilenameExtension(source);
    // Check if .ogv, which needs type="video/ogg"
    let sourceTypeVal = sourceType === 'ogv' ? 'ogg': sourceType;
    sourceNode.setAttribute('type', 'video/' + sourceTypeVal);
    element.appendChild(sourceNode);
  }

  function getFilenameExtension(filename) {
    let filenameSplit = filename.split('.');
    return filenameSplit[filenameSplit.length - 1];
  }

  function videoLoaded(video, element, container, fit, name) {
    element.style.position = 'absolute';
    removeVidWidthHeight(element);
    video.ratio = getVideoRatio(element, video);
    checkVideoSize(video, element, container.clientWidth, container.clientHeight, video.ratio, fit);
    toggleOpacity(element);
  }

  function removeVidWidthHeight(el) {
    el.style.width = '';
    el.style.height = '';
  }

  function replacePlaceholderDiv(div, newNode, container) {
    container.appendChild(newNode);
    container.removeChild(div);
  }

  function checkVideoSize(video, element, containerWidth, containerHeight, ratio, fit) {
    if (containerWidth >= containerHeight) {
      changeVideoSize(video, element, 'hr', containerWidth, containerHeight, ratio, fit);
    } else {
      changeVideoSize(video, element, 'vr', containerWidth, containerHeight, ratio, fit);
    }
  }

  function changeVideoSize(video, element, prefix, containerWidth, containerHeight, ratio, fit) {
    if ((containerWidth > containerHeight && fit === 'height') || (containerWidth / ratio <= containerHeight && fit === 'cover')) { //(containerWidth / ratio <= containerHeight)
      clearClass(element);
      addClass(element, prefix + 'h');
      video.currentClass = prefix + 'h';
    } else {
      clearClass(element);
      addClass(element, prefix + 'w');
      video.currentClass = prefix + 'w';
    }
  }

  /*
    Mobile
  */

  function createImgNode(video, element, container) {
    // If <source>/s exists, delete them
    if (video.sources == false) {
      deleteVideosSources(element);
    }
    let imageNode = createNode('img');
    imageNode.setAttribute('src', video.poster);
    imageNode.setAttribute('id', video.name.substring(1)); // substring to remove #
    imageNode.style.opacity = 0;
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

  // clientHeight/Width doesn't work if no video <source> defined (Firefox)
  // videoWidth, videoHeight break code when no video defined
  function getVideoRatio(el) {
    return calcRatio(el.clientWidth, el.clientHeight);
  }
  function clearClass(el) {
    return el.className = "";
  }
  function addClass(el, className) {
    return el.classList.add(className);
  }
  function createNode(tag) {
    return document.createElement(tag);
  }
  function calcRatio(width, height) {
    return width / height;
  }
  function decToPer(num) {
    return num * 100;
  }
  function toggleOpacity(el) {
    return el.style.opacity = el.style.opacity == 0 ? 1: 0;
  }
  function onResize(index) {
    window.onresize = () => env.videos[index].resize();
  }

  /*
    Other
  */

  function newVideo(args) {
    return new Video(args);
  }

  const env = new Env();

  return {
    video: newVideo
  }
})();
