// Sprite class constructor
var Sprite = function (image) {
  if (image) {
    this.image = image;
  } else {
    this.image = null;
  }
  this.animation = null;
}

// Sets the sprite image
Sprite.prototype.setImage = function (image) {
  this.image = image;
};

// Plays the given animation
Sprite.prototype.playAnimation = function (animation) {
  this.animation = animation;
  if (this.animation)
    this.animation.play();
};

// Loops the given animation
Sprite.prototype.loopAnimation = function (animation) {
  this.animation = animation;
  if (this.animation)
    this.animation.loop();
};

// Stops the playing animation
Sprite.prototype.stopAnimation = function () {
  this.animation = null;
};

// Renders the sprite at the given coordinates
Sprite.prototype.render = function (position, centered, hflip, vflip) {
  if (!centered)
    centered = true;
  if (!hflip)
		hflip = false;
	if (!vflip)
		vflip = false;

  if (this.animation) {
    if (this.animation.isPlaying()) {
      if (centered) {
        // Render the animation centered
        this.animation.render(Math.floor(position.x - this.animation.frameWidth / 2),
          Math.floor(position.y - this.animation.frameHeight / 2),
          hflip,
          vflip);
      } else {
        // Render the animation aligned to right
        this.animation.render(Math.floor(position.x),
          Math.floor(position.y),
          hflip,
          vflip);
      }
      return;
    } else {
      this.stopAnimation();
    }
  }
  if (this.image) {
    if (centered) {
      drawImage(this.image,
        Math.floor(position.x - getImageWidth(this.image) / 2),
        Math.floor(position.y - getImageHeight(this.image) / 2),
        hflip,
        vflip);
    } else {
      drawImage(this.image,
        Math.floor(position.x),
        Math.floor(position.y),
        hflip,
        vflip);
    }
  }
};
