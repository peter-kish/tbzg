// Gui class constructor
var Gui = function (scrWidth, scrHeight) {
  this.mainFrame = new GuiFrame(new Rect2d(0, 0, scrWidth, scrHeight));
}

// Renders the Gui
Gui.prototype.render = function () {
  this.mainFrame.render();
};

// Updates the Gui
Gui.prototype.update = function () {
  this.mainFrame.update();
};

// Handles the mouse click
Gui.prototype.handleMouseClick = function (x, y) {
  return this.mainFrame.handleMouseClick(x, y);
};

// Returns the GUI element with the given name
Gui.prototype.getElement = function (name) {
  return this.mainFrame.getElement(name);
};
