// Gui class constructor
var Gui = function (scrWidth, scrHeight) {
  this.mainFrame = new Frame(new Rect2d(0, 0, scrWidth, scrHeight));
}

// Renders the Gui
Gui.prototype.render = function () {
  this.mainFrame.render();
};

// Updates the Gui
Gui.prototype.update = function () {
  this.mainFrame.update();
};
