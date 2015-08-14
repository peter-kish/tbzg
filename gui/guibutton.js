// Button class constructor
var GuiButton = function (rect, color, onClickCallback) {
  GuiPanel.prototype.constructor.call(this, rect, color);
  this.onMouseClick = onClickCallback;
}

// Button class inherits the panel class
inherit(GuiButton, GuiPanel);

// Text button class constructor
var GuiTextButton = function (rect, title, color, onClickCallback) {
  GuiButton.prototype.constructor.call(this, rect, color, onClickCallback);
  this.guiText = new GuiText(new Rect2d(0, 0, rect.width, rect.height), title)
  this.addChild(this.guiText);
  this.guiText.onMouseClick = this.onMouseClick;
}

// Text button class inherits the button class
inherit(GuiTextButton, GuiButton);
