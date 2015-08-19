// Text class constructor
var GuiText = function (rect, text, color) {
  GuiFrame.prototype.constructor.call(this, rect, color);
  this.text = text;
  if (color) {
    this.color = color;
  } else {
    this.color = "#FFFFFF";
  }
  this.align = "center";
  this.baseline = "middle";
  this.style = "";
  this.size = 12;
}

// Text class inherits the frame class
inherit(GuiText, GuiFrame);

// Renders the text centered
GuiText.prototype.render = function () {
  var screenRect = this.getScreenRect();
  var delta;
  if (this.align == "center") {
    delta = new Vector2d(screenRect.width / 2, screenRect.height / 2);
  } else if (this.align == "left") {
    delta = new Vector2d(0, 0);
  } else if (this.align == "right") {
    delta = new Vector2d(screenRect.width, screenRect.height);
  }
  drawText(screenRect.x + delta.x,
    screenRect.y + delta.y,
    this.text,
    "Arial",
    this.size,
    this.color,
    this.style,
    this.align,
    this.baseline);
  GuiFrame.prototype.render.call(this);
};
