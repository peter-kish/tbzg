// Panel class constructor
var GuiPanel = function (rect, color) {
  GuiFrame.prototype.constructor.call(this, rect);
  if (color) {
    this.color = color;
  } else {
    this.color = "#000000";
  }

  // dont't let the mouse click event go further up the hierarchy
  this.onMouseClick = function() {};
}

// Panel class inherits the Frame class
inherit(GuiPanel, GuiFrame);

// Renders the panel
GuiPanel.prototype.render = function () {
  var screenRect = this.getScreenRect();
  drawRect(screenRect.x, screenRect.y, screenRect.width, screenRect.height, this.color);
  GuiFrame.prototype.render.call(this);
};

// Updates the panel
GuiPanel.prototype.update = function () {
  GuiFrame.prototype.update.call(this);
};
