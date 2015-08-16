// Image class constructor
var GuiImage = function (rect, image) {
  GuiFrame.prototype.constructor.call(this, rect, null);
  this.image = image;
  this.hflip = false;
  this.vflip = false;
}

// Image class inherits the frame class
inherit(GuiImage, GuiFrame);

// Renders the image
GuiImage.prototype.render = function () {
  var screenRect = this.getScreenRect();
  drawImageResized(this.image,
    screenRect.x,
    screenRect.y,
    screenRect.width,
    screenRect.height,
    this.hflip,
    this.vflip);
  GuiFrame.prototype.render.call(this);
};
