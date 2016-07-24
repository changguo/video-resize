# video-resize

Efficiently scale HTML5 videos.

![video-resize in action](assets/images/video-resize.gif?raw=true)


## Use

Define empty div:

```html
<div id="video"></div>
```

Create a video object:

```javascript
var video = new videoResize({
  element: '#video',
  sources: 'video.mp4',
  poster: 'video.jpg'
});
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
  mobilePoster: 'airhorn-mobile.jpg',
  align: {x: 0.2, y: 0.5},
  autoplay: true,
  fit: 'cover',
  loop: true,
  mobileBreak: 720,
  mute: false,
  scale: 0.75
});
```
### `align`

Defines the position of the video within the container. `align: {x: 0.5, y: 0.5}` will result in a centered video.

##### Default: `x: 0.5, y: 0.5`

### `fit`

Determines how the video will resize inside its parent.

* `'cover'`: fill container
* `'width'`: resize by width only
* `'height'`: resize by height only

##### Default: `'cover'`

### `mobileBreak`

Determines the maximum screen width for mobile layout. When the screen width is smaller than or equal to the `mobileBreak` value, the video is instead rendered as a static `<img>` with the `poster`/`mobilePoster` source.

##### Default: 1024

### `mobilePoster`

The image displayed on devices with a screen width under that of the `mobileBreak` value.

### `poster`

The image displayed while the video loads. If no `mobilePoster` is defined, it will be used on mobile devices.

### `scale`

Defines the size of the video within the container. `scale: 1.0` is 100%.

##### Default: 1.0

### `sources`

Can be defined as a singular source `'airhorn.mp4'` or array `['airhorn.mp4'. 'airhorn.ogg']`.

## Other

- The shorthand `vr` can be used instead of `videoResize`
