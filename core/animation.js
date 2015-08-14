// Animation states:
var ANM_ST_STOPPED = 0;
var ANM_ST_PLAYING = 1;
var ANM_ST_LOOPING = 2;
var ANM_ST_PAUSED = 3;

// Animation class constructor
var Animation = function(image, duration, frameW, frameH) {
  this.image = image;
  this.frameWidth = frameW;
  this.frameHeight = frameH;
  this.frameCount = 0;
  if (image) {
    this.frameCount = Math.floor(getImageWidth(image) / frameW);
  }
  this.currentFrame = 0;
  this.duration = duration;
  this.state = new StateMachine(ANM_ST_STOPPED);
  this.timer = new Timer();
}

// Renders the current animation frame at the given coordinates
Animation.prototype.render = function (x, y, hflip, vflip) {
  this.renderProgress(x, y, this.timer.getProgress(), hflip, vflip)
};

// Renders the animation frame at the given progress
Animation.prototype.renderProgress = function (x, y, progress, hflip, vflip) {
  if (progress == 1)
    progress = 0;
  var frameNum = Math.floor(progress * this.frameCount);
  drawImageCropped(this.image,
    frameNum * this.frameWidth,
    0,
    this.frameWidth,
    this.frameHeight,
    x,
    y,
    this.frameWidth,
    this.frameHeight,
    hflip,
    vflip);
};

// Starts the animation with the given delay between frames
Animation.prototype.play = function (duration) {
  this.state.setState(ANM_ST_PLAYING);
  if (duration)
    this.duration = duration;
  this.timer.start(this.duration);
};

// Starts looping the animation with the given delay between frames
Animation.prototype.loop = function (duration) {
  this.state.setState(ANM_ST_LOOPING);
  if (duration)
    this.duration = duration;
  this.timer.start(this.duration);
};

// Stops the animation
Animation.prototype.stop = function () {
  this.state.setState(ANM_ST_STOPPED);
  this.currentFrame = 0;
  this.timer.stop();
};

// Pauses the animation
Animation.prototype.pause = function () {
  this.state.setState(ANM_ST_PAUSED);
};

// Checks if the animation is playing
Animation.prototype.isPlaying = function () {
  var currentState = this.state.getState();
  return (currentState == ANM_ST_PLAYING) || (currentState == ANM_ST_LOOPING);
};

// Updates the animation
Animation.prototype.update = function () {
  var currentState = this.state.getState();
  if (currentState == ANM_ST_PLAYING || currentState == ANM_ST_LOOPING) {
    if (this.timer.isTimeUp()) {
      if (currentState == ANM_ST_PLAYING) {
        // playing state
        this.stop();
      } else {
        // looping state
        this.timer.reset();
      }
    }
  }
};
