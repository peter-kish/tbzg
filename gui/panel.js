// Panel class constructor
var Panel = function (rect, color) {
  Frame.prototype.constructor.call(this, rect);
  this.color = color;
}

// Panel class inherits the Frame class
inherit(Panel, Frame);


// Renders the panel
Panel.prototype.render = function () {
  var screenPos = this.getScreenPosition();
  drawRect(screenPos.x, screenPos.y, this.rect.width, this.rect.height, this.color);
  Frame.prototype.render.call(this);
};

// Updates the panel
Panel.prototype.update = function () {
  Frame.prototype.update.call(this);
};
