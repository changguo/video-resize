// video-min
// Scales videos to fit frame, basic video controls
// Developed by Robert Janes
// robertjanes.com.au

// Documentation needed

var videoMin = function() {

  var video;
  var container;
  var ratio;

  // function init(videoRef, containerRef) {
  //   video = document.querySelector(videoRef);
  //   container = document.querySelector(containerRef);
  //   createStyles(videoRef);
  //   onLoad(videoRef);
  // }

  this.init = function init(data) {
    video = document.querySelector(data.videoRef);
    container = document.querySelector(data.containerRef);
    createStyles(data.videoRef, data.scale, data.alignment);
    onLoad(data.videoRef);
  }

  function createStyles(videoRef, scale, alignment) { // Needs to be more modular
    var videoMinCSS = document.createElement("style");
    !scale
      ? scale = 100
      : scale = scale * 100;
    document.head.appendChild(videoMinCSS);
    videoMinCSS.sheet.insertRule(videoRef + '.hrh { height: ' + scale + '%; }', 0);
    videoMinCSS.sheet.insertRule(videoRef + '.hrw { width: ' + scale + '%; }', 0);
    videoMinCSS.sheet.insertRule(videoRef + '.vrh { height: ' + scale + '%; }', 0);
    videoMinCSS.sheet.insertRule(videoRef + '.vrw { width: ' + scale + '%; }', 0);
    if (alignment) {
      if (alignment.y && alignment.x) {
        videoMinCSS.sheet.insertRule(videoRef + ' { transform: translate(-50%, -50%); top: 50%; left: 50%; }', 0);
      } else if (alignment.x) {
        videoMinCSS.sheet.insertRule(videoRef + ' { -webkit-transform: translateX(-50%); right: 50%; }', 0);
      }
      if (alignment.y) {
        videoMinCSS.sheet.insertRule(videoRef + ' { transform: translateY(-50%); top: 50%; }', 0);
      } else if (alignment.x) {
        videoMinCSS.sheet.insertRule(videoRef + ' { -webkit-transform: translateX(-50%); right: 50%; }', 0);
      }
    }
  }

  function onLoad(videoRef) {
    console.log(videoRef);
    document.querySelector(videoRef).addEventListener( "loadedmetadata", function (e) {
      ratio = getRatio();
      videoSize();
    });
  }

  function getRatio() {
    return calcRatio(video.videoWidth,video.videoHeight);
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
    video.className = "";
  }

  function addClass(className) {
    video.classList.add(className);
  }

  function togglePlay(editText, element) {
    if (video.paused) {
      video.play();
      if (editText) changeText(element,'Pause');
    } else {
      video.pause();
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
