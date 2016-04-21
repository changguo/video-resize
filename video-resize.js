// video-resize.js v0.6.6
// 21 April 2016
// ———
// Javascript library for efficiently
// scaling HTML5 videos with CSS
// ———
// Developed by Robert Janes
// robertjanes.com.au

var videoResize = (function() {

  var videos = [];
  var videoIndex = 0;

  function videoResize(data) {
    this.name = data.element;
    this.element = document.querySelector(data.element);
    this.container = this.element.parentElement;
    this.sources = checkSourcesInput(data.sources);
    this.scale = checkScaleInput(data.scale);
    this.alignment = checkAlignmentInput(data.align);
    this.fit = checkFitInput(data.fit);
    this.mobileBreak = checkMobileBreakInput(data.mobileBreak);
    this.currentClass = '';
    addNewVideo(this);

    this.init = function init() {
      toggleOpacity(this.element);
      this.styles = getStyles(this.name, this.scale, this.alignment, this.element);
      setOnLoad(this, this.element, this.container, this.fit, this.mobileBreak, this.sources, this.name);
      this.index = videoIndex;
      onResize(this.index);
      videoIndex +=1;
    };

    this.resize = function resize() {
      checkVideoSize(this, this.element, this.container.clientWidth, this.container.clientHeight, this.ratio, this.fit);
    };

    this.toggleVisible = function toggleVisible() {
      toggleOpacity(this.element);
    };
  }

  function checkSourcesInput(sources) {
    return !sources
      ? false
      : sources;
  }

  function checkScaleInput(scale) {
    return !scale
      ? 1
      : scale;
  }

  function checkAlignmentInput(alignment) {
    if (!alignment) {
      alignment = {x: 0.5, y: 0.5};
    } else if (!alignment.x) {
      alignment.x = 0;
    } else if (!alignment.y) {
      alignment.y = 0;
    }
    return alignment;
  }

  function checkFitInput(fit) {
    return !fit
      ? 'cover'
      : fit;
  }

  function checkMobileBreakInput(mobileBreak) {
    return !mobileBreak
      ? 1024
      : mobileBreak;
  }

  function addNewVideo(video) {
    videos.push(video);
  }

  function toggleOpacity(object) {
    object.style.opacity !== '0'
      ? object.style.opacity = '0'
      : object.style.opacity = '1';
  }

  function getStyles(videoRef, scale, alignment, element) {
    var videoStyles = createStyleSheet();
    createScaleStyles(videoStyles, videoRef, scale * 100);
    createAlignStyles(videoStyles, videoRef, alignment, element);
    return videoStyles;
  }

  function createStyleSheet() {
    var sheet = document.createElement("style");
    document.head.appendChild(sheet);
    return sheet;
  }

  function createScaleStyles(videoStyles, videoRef, scale) {
    videoStyles.sheet.insertRule(videoRef + '.hrh { height: ' + scale + '%; }', 0);
    videoStyles.sheet.insertRule(videoRef + '.hrw { width: ' + scale + '%; }', 0);
    videoStyles.sheet.insertRule(videoRef + '.vrh { height: ' + scale + '%; }', 0);
    videoStyles.sheet.insertRule(videoRef + '.vrw { width: ' + scale + '%; }', 0);
  }

  function createAlignStyles(videoStyles, videoRef, alignment, element) {
    var alignmentPercent = {
      x: decimalToPercent(alignment.x),
      y: decimalToPercent(alignment.y)
    };
    // Vender prefixes aren't apparent in browser, but do work.
    // To-address: this is a very long expression.
    videoStyles.sheet.insertRule(videoRef +
      ' { -webkit-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -moz-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -ms-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -o-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' top: ' + alignmentPercent.y + '%;' +
      ' left: ' + alignmentPercent.x + '%; }', 0);
  }

  function setOnLoad(video, element, container, fit, mobileBreak, sources, name) {
    if (!checkIfMobile(mobileBreak)) {
      if (sources !== false) activateVideos(element, sources);
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
      imageElement = deactivateVideos(video, element, container);
      video.element = imageElement; // Update element object
      imageElement.onload = function() { // Prevents clientWidth/Height returning 0
        videoLoaded(video, imageElement, container, fit, name);
      };
    }
  }

  function checkIfMobile(mobileBreak) {
    return window.innerWidth <= mobileBreak
      ? true
      : false;
  }

  function activateVideos(element, sources) {
    // Check if multiple sources entered
    if (Array.isArray(sources)) {
      for (var s=0; s < sources.length; s+=1) {
        createSourceNode(element, sources[s]);
      }
    } else {
      createSourceNode(element, sources);
    }
  }

  function createSourceNode(element, source) {
    var sourceNode = createNode('source');
    sourceNode.setAttribute('src', source);
    var sourceSplit = source.split('.');
    // Check if .ogv, which needs type="video/ogg"
    var sourceType = sourceSplit[sourceSplit.length - 1] === 'ogv'
      ? 'ogg'
      : sourceSplit[sourceSplit.length - 1];
    sourceNode.setAttribute('type', 'video/' + sourceType);
    element.appendChild(sourceNode);
  }

  function deactivateVideos(video, element, container) {
    // If <source>/s exists, delete them
    if (video.sources === false) {
      deleteVideosSources(element);
    }
    var image = createNode('img');
    image.setAttribute('src', element.getAttribute('poster'));
    image.setAttribute('id', video.name.substring(1)); // substring to remove #
    image.style.opacity = 0;
    container.insertBefore(image, element);
    container.removeChild(element);
    return image;
  }

  function deleteVideosSources(element) {
    var sources = element.querySelectorAll('source');
    for (var s=0; s < sources.length; s+=1) {
      element.removeChild(sources[s]);
      element.load(); // forces browser to abadon buffering
    }
  }

  function videoLoaded(video, element, container, fit, name) {
    element.style.position = 'absolute';
    removeVideoWidthHeight(element);
    video.ratio = getVideoRatio(element, video);
    checkVideoSize(video, element, container.clientWidth, container.clientHeight, video.ratio, fit);
    toggleOpacity(element);
  }

  function createNode(tag) {
    return document.createElement(tag);
  }

  function onResize(index) {
    window.onresize = function() {
      videos[index].resize();
    };
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

  function clearClass(element) {
    element.className = "";
  }

  function addClass(element, className) {
    element.classList.add(className);
  }

  function getVideoRatio(element) {
    // clientHeight/Width doesn't work if no video <source> defined (Firefox)
    // videoWidth, videoHeight break code when no video defined
    return calcRatio(element.clientWidth, element.clientHeight);
  }

  function calcRatio(width, height) {
    return width / height;
  }

  function decimalToPercent(number) {
    return number * 100;
  }

  function removeVideoWidthHeight(element) {
    // Remove any width/height pre-defined in style tag
    element.style.width = '';
    element.style.height = '';
  }

  return videoResize;
})();
