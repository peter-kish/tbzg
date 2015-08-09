// Animation states:
var ANM_ST_STOPPED = 0;
var ANM_ST_PLAYING = 1;
var ANM_ST_PAUSED = 2;

// Animation class constructor
var Animation = function(image, frameDelay, frameW, frameH) {
  this.image = image;
  this.frameWidth = frameW;
  this.frameHeight = frameHeight;
  if (image) {
    this.frameCount = Math.floor(getImageWidth(image) / frameWidth);
  } else {
    this.frameCount = 0;
  }
  this.currentFrame = 0;
  this.frameDelay = frameDelay;
  this.state = new StateMachine(ANM_ST_STOPPED);
  this.frameTimer = new Timer();
}

// Renders the current animation frame at the given coordinates
Animation.prototype.render = function (x, y, hflip, vflip) {
  var imgW = getImageWidth(this.image);
  var imgH = getImageHeight(this.image);
  drawImageCropped(this.image, this.currentFrame * imgW, 0, imgW, imgH, x, y, imgW, imgH, hflip, vflip);
};

// Renders the animation frame at the given progress
Animation.prototype.renderProgress = function (x, y, progress, hflip, vflip) {
  var imgW = getImageWidth(this.image);
  var imgH = getImageHeight(this.image);
  var frameNum = Math.floor(progress * this.frameCount);
  drawImageCropped(this.image, frameNum * imgW, 0, imgW, imgH, x, y, imgW, imgH, hflip, vflip);
};

// Starts the animation with the given delay between frames
Animation.prototype.start = function (frameDelay) {
  this.state.setState(ANM_ST_PLAYING);
  if (frameDelay)
    this.frameDelay = frameDelay;
  this.frameTimer.start(this.frameDelay);
};

// Stops the animation
Animation.prototype.stop = function () {
  this.setState(ANM_ST_STOPPED);
  this.currentFrame = 0;
};

// Pauses the animation
Animation.prototype.pause = function () {
  this.setState(ANM_ST_PAUSED);
};

// Updates the animation
Animation.prototype.update = function () {
  if (this.state.getState() == ANM_ST_PLAYING) {
    if (this.frameTimer.isTimeUp()) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.frameTimer.reset();
    }
  }
};
