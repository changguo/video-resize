# video-min

![video-min.js in action](assets/video-min.gif?raw=true)

A small Javascript library that efficiently scales HTML5 video with CSS classes.

## Use

Create a video object

```javascript
var video = new videoMin({element: '#video'});
```

Initiate videoMin

```javascript
video.init();
```

### Options

Define options when creating the video object

```javascript
var video = new videoMin({element: '#video', scale: 0.75, align: {x: 0.2, y: 0.5}, fit: 'cover'});
```


