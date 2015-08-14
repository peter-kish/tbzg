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
  var screenPos = this.getScreenPosition();
  drawText(screenPos.x + this.rect.width / 2,
    screenPos.y + this.rect.height / 2,
    this.text,
    "Arial",
    this.size,
    this.color,
    this.style,
    this.align,
    this.baseline);
  GuiFrame.prototype.render.call(this);
};
