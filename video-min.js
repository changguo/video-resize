// video-min.js
// Scales html5 videos to fit frame
// Developed by Robert Janes
// robertjanes.com.au

var videoMin = (function() {

  var videos = [];

  function videoMin(data) {
    this.ref = data.element;
    this.element = document.querySelector(data.element);
    this.element.container = this.element.parentElement;
    this.scale = checkScale(data.scale);
    this.alignment = checkAlignment(data.align);
    this.element.fit = checkFit(data.fit);
    addNewVideo(this);

    this.init = function init() {
      toggleVideoDisplay(this.element);
      this.element.style.position = 'absolute';
      this.styles = getStyles(this.ref, this.scale, this.alignment);
      this.onLoad();
    };

    this.onLoad = function onLoad() {
      this.element.addEventListener( "loadedmetadata", function (e) {
        this.ratio = getRatio(this);
        videoSize(this, this.container.clientWidth, this.container.clientHeight, this.ratio, this.fit);
        toggleVideoDisplay(this);
      });
    };

    this.resize = function resize() {
      videoSize(this.element, this.element.container.clientWidth, this.element.container.clientHeight, this.element.ratio, this.element.fit);
    };

    this.toggleDisplay = function toggleDisplay() {
      toggleVideoDisplay(this.element);
    };
  }

  function checkScale(scale) {
    return !scale
      ? 1
      : scale;
  }

  function checkAlignment(alignment) {
    if (!alignment) {
      alignment = {x: 0.5, y: 0.5};
    } else if (!alignment.x) {
      alignment.x = 0;
    } else if (!alignment.y) {
      alignment.y = 0;
    }
    return alignment;
  }

  function checkFit(fit) {
    return !fit
      ? 'cover'
      : fit;
  }

  function addNewVideo(video) {
    videos.push(video);
  }

  function toggleVideoDisplay(object) {
    object.style.opacity !== '0'
      ? object.style.opacity = '0'
      : object.style.opacity = '1';
  }

  function getStyles(videoRef, scale, alignment) { // Needs to be more modular
    var sheet = creatCssSheet();
    var scale = createScaleStyle(sheet, videoRef, scale * 100);
    var align = createAlignStyle(sheet, videoRef, alignment);
    return sheet;
  }

  function creatCssSheet() {
    videoCSS = document.createElement("style");
    document.head.appendChild(videoCSS);
    return videoCSS;
  }

  function createScaleStyle(videoCSS, videoRef, scale) {
    videoCSS.sheet.insertRule(videoRef + '.hrh { height: ' + scale + '%; }', 0);
    videoCSS.sheet.insertRule(videoRef + '.hrw { width: ' + scale + '%; }', 0);
    videoCSS.sheet.insertRule(videoRef + '.vrh { height: ' + scale + '%; }', 0);
    videoCSS.sheet.insertRule(videoRef + '.vrw { width: ' + scale + '%; }', 0);
  }

  function createAlignStyle(videoCSS, videoRef, alignment) {
    var alignmentPercent = {
      x: decimalToPercent(alignment.x),
      y: decimalToPercent(alignment.y)
    };
    // Error: vender-prefixes don't work.
    videoCSS.sheet.insertRule(videoRef +
      ' { -webkit-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -moz-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -ms-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -o-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' top: ' + alignmentPercent.y + '%;' +
      ' left: ' + alignmentPercent.x + '%; }', 0);
  }

  function getRatio(element) {
    return calcRatio(element.videoWidth, element.videoHeight);
  }

  function calcRatio(width, height) {
    return width / height;
  }

  function decimalToPercent(decimal) {
    return decimal * 100;
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

  window.onresize = function() {
    for (var v=0; v <= videos.length - 1; v+=1) {
      videos[v].resize();
    }
  };

  return videoMin;
})();
