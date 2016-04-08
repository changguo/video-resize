// video-min
// Scales html5 videos to fit frame, basic video controls
// Developed by Robert Janes
// robertjanes.com.au

// Documentation needed

var videoMin = function() {

  var video;
  var container;
  var ratio;
  var videoCss;

  var Video = {

  }

  this.init = function init(data) {
    video = Object.create(Video);
    video.object = document.querySelector(data.videoRef);
    toggleVideoDisplay(); // Prevents flash-of-unstyled-video
    container = document.querySelector(data.containerRef);
    getStyles(data.videoRef, data.scale, data.alignment);
    onLoad(data.videoRef);
  }

  function toggleVideoDisplay() {
    video.object.style.opacity !== '0'
      ? video.object.style.opacity = '0'
      : video.object.style.opacity = '1';
  }

  function getStyles(videoRef, scale, alignment) { // Needs to be more modular
    creatCssSheet();
    createScaleStyle(videoCSS, videoRef, scale);
    createAlignStyle(videoCSS, videoRef, alignment);
  }

  function creatCssSheet() {
    videoCSS = document.createElement("style");
    document.head.appendChild(videoCSS);
  }

  function createScaleStyle(videoCSS, videoRef, scale) {
    !scale
      ? scale = 100
      : scale = scale * 100;
    video.object.style.position = 'absolute';
    videoCSS.sheet.insertRule(videoRef + '.hrh { height: ' + scale + '%; }', 0);
    videoCSS.sheet.insertRule(videoRef + '.hrw { width: ' + scale + '%; }', 0);
    videoCSS.sheet.insertRule(videoRef + '.vrh { height: ' + scale + '%; }', 0);
    videoCSS.sheet.insertRule(videoRef + '.vrw { width: ' + scale + '%; }', 0);
  }

  function createAlignStyle(videoCSS, videoRef, alignment) {
    if (!alignment) {
      alignment = {x: 0.5, y: 0.5};
    } else if (!alignment.x) {
      alignment.y = 0;
    } else if (!alignment.y) {
      alignment.y = 0;
    }
    if (alignment.x > 1 || alignment.x < 0) alignment.x = 1;
    if (alignment.y > 1 || alignment.y < 0) alignment.y = 1;

    var alignmentPercent = {
      x: decimalToPercent(alignment.x),
      y: decimalToPercent(alignment.y)
    };

    // Bug: vender-prefixes don't work.
    videoCSS.sheet.insertRule(videoRef +
      ' { -webkit-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -moz-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -ms-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' -o-transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' transform: translate(-' + alignmentPercent.x + '%, -' + alignmentPercent.y + '%);' +
      ' top: ' + alignmentPercent.y + '%;' +
      ' left: ' + alignmentPercent.x + '%; }', 0);
  }

  function onLoad(videoRef) {
    document.querySelector(videoRef).addEventListener( "loadedmetadata", function (e) {
      ratio = getRatio();
      videoSize(container.clientWidth, container.clientHeight);
      toggleVideoDisplay();
    });
  }

  function getRatio() {
    return calcRatio(video.object.videoWidth,video.object.videoHeight);
  }

  function calcRatio(width,height) {
    return width / height;
  }

  function decimalToPercent(decimal) {
    return decimal * 100;
  }

  function videoSize(containerWidth, containerHeight) {
    if (containerWidth >= containerHeight) {
      changeVideoSize('hr', containerWidth, containerHeight);
    } else {
      changeVideoSize('vr', containerWidth, containerHeight);
    }
  }

  function changeVideoSize(prefix, containerWidth, containerHeight) {
    if (containerWidth / ratio <= containerHeight) {
      clearClass();
      addClass(prefix + 'h');
    } else {
      clearClass();
      addClass(prefix + 'w');
    }
  }

  function clearClass() {
    video.object.className = "";
  }

  function addClass(className) {
    video.object.classList.add(className);
  }

  // function togglePlay(editText, element) {
  //   if (video.object.paused) {
  //     video.object.play();
  //     if (editText) changeText(element,'Pause');
  //   } else {
  //     video.object.pause();
  //     if (editText) changeText(element,'Play');
  //   }
  // }

  function toggleMute(editText, element) {
    if (video.muted) {
      video.muted = false;
      if (editText) changeText(element,'Mute');
    } else {
      video.muted = true;
      if (editText) changeText(element,'Unmute');
    }
  }

  function changeText(element, text) {
    element.innerHTML = text;
  }

  window.onresize = function() {
    videoSize(container.clientWidth, container.clientHeight);
  };

  return {
    init: init,
    toggleMute: toggleMute
  };
}();
