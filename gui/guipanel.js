// Panel class constructor
var GuiPanel = function (rect, color) {
  GuiFrame.prototype.constructor.call(this, rect);
  if (color) {
    this.color = color;
  } else {
    this.color = "#000000";
  }
}

// Panel class inherits the Frame class
inherit(GuiPanel, GuiFrame);

// Renders the panel
GuiPanel.prototype.render = function () {
  var screenPos = this.getScreenPosition();
  drawRect(screenPos.x, screenPos.y, this.rect.width, this.rect.height, this.color);
  GuiFrame.prototype.render.call(this);
};

// Updates the panel
GuiPanel.prototype.update = function () {
  GuiFrame.prototype.update.call(this);
};
