// Button class constructor
var GuiButton = function (rect, color, onClickCallback) {
  GuiPanel.prototype.constructor.call(this, rect, color);
  this.onMouseClick = onClickCallback;
}

// Button class inherits the panel class
inherit(GuiButton, GuiPanel);
