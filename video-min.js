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

  function Video() {

  }

  this.init = function init(data) {
    //video = document.querySelector(data.videoRef);
    video = new Video();
    video.object = document.querySelector(data.videoRef);
    toggleVideoDisplay();
    container = document.querySelector(data.containerRef);
    getStyles(data.videoRef, data.scale, data.alignment);
    onLoad(data.videoRef  );
  }

  function toggleVideoDisplay() { // Prevents flash-of-unstyled-video
    console.log(video.object);
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
    if (!alignment) alignment = {x: 0.5, y: 0.5};
    if (alignment.x > 1 || alignment.x < 0) {
      alignment.x = 1;
    }
    if (alignment.y > 1 || alignment.y < 0) {
      alignment.y = 1;
    } else if (alignment) {
      if (alignment.y && alignment.x) {
        videoCSS.sheet.insertRule(videoRef + ' { -webkit-transform: translate(-' + alignment.x * 100 + '%, -' + alignment.y * 100 + '%); top: ' + alignment.y * 100 + '%; left: ' + alignment.x * 100 + '%; }', 0);
      } else if (alignment.x) {
        videoCSS.sheet.insertRule(videoRef + ' { -webkit-transform: translateX(-' + alignment.x * 100 + '%); right: ' + alignment.x * 100 + '%; }', 0);
      } else if (alignment.y) {
        videoCSS.sheet.insertRule(videoRef + ' { -webkit-transform: translateY(-' + alignment.y * 100 + '%); top: ' + alignment.y * 100 + '%; }', 0);
      }
    }
  }

  function onLoad(videoRef) {
    document.querySelector(videoRef).addEventListener( "loadedmetadata", function (e) {
      ratio = getRatio();
      videoSize();
      toggleVideoDisplay();
    });
  }

  function getRatio() {
    return calcRatio(video.object.videoWidth,video.object.videoHeight);
  }

  function calcRatio(width,height) {
    return width / height;
  }

  function videoSize() {
    if (container.clientWidth >= container.clientHeight) {
      changeVideoSize('hr');
    } else {
      changeVideoSize('vr');
    }
  }

  function changeVideoSize(prefix) {
    if (container.clientWidth / ratio <= container.clientHeight) {
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

  function togglePlay(editText, element) {
    if (video.object.paused) {
      video.object.play();
      if (editText) changeText(element,'Pause');
    } else {
      video.object.pause();
      if (editText) changeText(element,'Play');
    }
  }

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
    videoSize();
  };

  this.myMethod = function myMethod(video) {
    alert( 'my method' + name.first );
  };

  return {
    init: init,
    myMethod: myMethod,
    togglePlay: togglePlay,
    toggleMute: toggleMute
  };
}();
