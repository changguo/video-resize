// video-min.js 0.6
// ———
// A small Javascript library that efficiently
// scales HTML5 video with CSS classes
// ——
// Developed by Robert Janes
// robertjanes.com.au

var videoMin = (function() {

  var videos = [];
  var videoIndex = 0;

  function videoMin(data) {
    this.ref = data.element;
    this.element = document.querySelector(data.element);
    this.container = this.element.parentElement;
    this.scale = checkScale(data.scale);
    this.alignment = checkAlignment(data.align);
    this.fit = checkFit(data.fit);
    addNewVideo(this);

    this.init = function init() {
      toggleOpacity(this.element);
      this.element.style.position = 'absolute';
      this.styles = getStyles(this.ref, this.scale, this.alignment);
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

  function checkScale(scale) {
    return !scale
      ? 1
      : scale;
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

  function toggleOpacity(object) {
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

  return videoMin;
})();
