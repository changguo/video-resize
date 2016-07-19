# video-resize

![video-resize.js in action](assets/video-resize.gif?raw=true)

Efficiently scale HTML5 videos.

## Use

Create a video object:

```javascript
var video = new videoResize({element: '#video'});
```

Initialize the video:

```javascript
video.init();
```

After updating initial options:

```javascript
video.update();
```

## Options

```javascript
var video = new videoResize({
  element: '#video',
  sources: 'airhorn.mp4',
  poster: 'airhorn.jpg',
  align: {x: 0.2, y: 0.5},
  autoplay: true,
  fit: 'cover',
  loop: true,
  mobileBreak: 720,
  mute: false,
  scale: 0.75
});
```
### ```align```

Defines the position of the video within the container. `align: {x: 0.5, y: 0.5}` will result in a centered video.

##### Default: `x: 0.5, y: 0.5`

### ```fit```

Determines how the video will resize.
* `'cover'` video will always fill container
* `'width'` will resize by width only
* `'height'` will resize by height only

##### Default: `'cover'`

### ```mobileBreak```

Determines the maximum screen width for mobile layout. When the screen width is smaller than the ```mobileBreak``` value, the video is rendered as a static ```<img>``` with the poster source.

##### Default: 1025

### ```scale```

Defines the size of the video within the container. `scale: 1.0` is 100%.

##### Default: 1.0

### ```sources```

Can be defined as a singular source or array `['airhorn.mp4'. 'airhorn.ogg']`.

##### Default: 1.0
