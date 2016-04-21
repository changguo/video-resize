# video-resize

![video-min.js in action](assets/video-resize.gif?raw=true)

Javascript library for efficiently scaling HTML5 videos with CSS classes.

## Use

Create a video object:

```javascript
var video = new videoResize({element: '#video'});
```

Initiate videoResize:

```javascript
video.init();
```

### Options

Define options when creating the video object

```javascript
var video = new videoResize({element: '#video', mobileBreak: 720, scale: 0.75, align: {x: 0.2, y: 0.5}, fit: 'cover'});
```

The default options are:
* `mobileBreak: 1025`
* `fit: 'cover'`
* `scale: 1.0`
* `align: {x: 0.5, y: 0.5}`

#### ```mobileBreak```

Determines the maximum screen width for mobile layout. When the screen width is smaller than the ```mobileBreak``` value, the video is rendered as a static ```<img>```.

```javascript
var video = new videoResize({element: '#video', mobileBreak: 414);
```

#### ```fit```

Determines how the video will resize.
* `fit: 'cover'` video will always fill container
* `fit: 'width'` will resize by width only
* `fit: 'height'` will resize by height only

```javascript
var video = new videoResize({element: '#video', fit: 'height');
```

#### ```scale```

Defines the size of the video within the container. `scale: 1.0` is 100%.

```javascript
var video = new videoResize({element: '#video', scale: 0.75});
```

#### ```align```

Defines the position of the video within the container. `align: {x: 0.5, y: 0.5}` will result in a centered video.

```javascript
var video = new videoResize({element: '#video', align: {x: 0, y: 1}); // Bottom-left of container
```
