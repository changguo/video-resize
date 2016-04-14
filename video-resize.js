// video-resize.js 0.6.5
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
    this.scale = checkScaleInput(data.scale);
    this.alignment = checkAlignmentInput(data.align);
    this.fit = checkFitInput(data.fit);
    addNewVideo(this);

    this.init = function init() {
      toggleOpacity(this.element);
      this.element.style.position = 'absolute';
      this.styles = getStyles(this.name, this.scale, this.alignment, this.element);
      setOnLoad(this, this.element, this.container, this.fit);
      this.index = videoIndex;
      onResize(this.index);
      videoIndex +=1;
    };

    this.resize = function resize() {
      videoSize(this.element, this.container.clientWidth, this.container.clientHeight, this.ratio, this.fit);
    };

    this.toggleVisible = function toggleVisible() {
      toggleOpacity(this.element);
    };
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

  function addNewVideo(video) {
    videos.push(video);
  }

  function toggleOpacity(object) {
    object.style.opacity !== '0'
      ? object.style.opacity = '0'
      : object.style.opacity = '1';
  }

  function getStyles(videoRef, scale, alignment, element) { // Needs to be more modular
    var videoStyles = createStyleSheet();
    createScaleStyles(videoStyles, videoRef, scale * 100);
    createAlignStyles(videoStyles, videoRef, alignment, element);
    return videoStyles;
  }

  function createStyleSheet() {
    var videoStyles = document.createElement("style");
    document.head.appendChild(videoStyles);
    return videoStyles;
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
    videoStyles.sheet.insertRule(videoRef +
      ' { -webkit-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -moz-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -ms-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -o-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' top: ' + alignmentPercent.y + '%;' +
      ' left: ' + alignmentPercent.x + '%; }', 0);
  }

  function setOnLoad(video, element, container, fit) {
    element.addEventListener( "loadedmetadata", function (e) {
      video.ratio = getVideoRatio(element);
      videoSize(element, container.clientWidth, container.clientHeight, video.ratio, fit);
      toggleOpacity(element);
    });
  }

  function onResize(index) {
    window.onresize = function() {
      videos[index].resize();
    };
  }

  function videoSize(element, containerWidth, containerHeight, ratio, fit) {
    if (containerWidth >= containerHeight) {
      changeVideoSize(element, 'hr', containerWidth, containerHeight, ratio, fit);
    } else {
      changeVideoSize(element, 'vr', containerWidth, containerHeight, ratio, fit);
    }
  }

  function changeVideoSize(element, prefix, containerWidth, containerHeight, ratio, fit) {
    if ((containerWidth > containerHeight && fit === 'height') || (containerWidth / ratio <= containerHeight && fit === 'cover')) { //(containerWidth / ratio <= containerHeight)
      clearClass(element);
      addClass(element, prefix + 'h');
    } else {
      clearClass(element);
      addClass(element, prefix + 'w');
    }
  }

  function clearClass(element) {
    element.className = "";
  }

  function addClass(element, className) {
    element.classList.add(className);
  }

  function getVideoRatio(element) {
    return calcRatio(element.videoWidth, element.videoHeight);
  }

  function calcRatio(width, height) {
    return width / height;
  }

  function decimalToPercent(number) {
    return number * 100;
  }

  return videoResize;
})();
