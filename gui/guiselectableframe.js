// Selectable frame class constructor
var GuiSelectableFrame = function (rect, color, frameThickness) {
  GuiFrame.prototype.constructor.call(this, rect);
  if (color) {
    this.color = color;
  } else {
    this.color = "#FFFFFF";
  }

  if (frameThickness) {
    this.frameThickness = frameThickness;
  } else {
    this.frameThickness = 1;
  }
  this.selected = false;
}

// Selectable frame class inherits the frame class
inherit(GuiSelectableFrame, GuiFrame);

// Selects the frame
GuiSelectableFrame.prototype.setSelected = function (sel) {
  this.selected = sel;
};

// Returns if the frame is selected
GuiSelectableFrame.prototype.getSelected = function () {
  return this.selected;
};

// Renders the selectable frame
GuiSelectableFrame.prototype.render = function () {
  GuiFrame.prototype.render.call(this);
  if (this.getSelected()) {
    var screenRect = this.getScreenRect();
    drawRectOutline(screenRect.x,
      screenRect.y,
      screenRect.width,
      screenRect.height,
      this.frameThickness,
      this.color);
  }
};

GuiSelectableFrame.prototype.handleMouseClick = function (x, y) {
  if (!this.visible) {
    return false;
  }

  var screenRect = this.getScreenRect();
  if (x > screenRect.x && x < screenRect.x + screenRect.width) {
    if (y > screenRect.y && y < screenRect.y + screenRect.height) {
      this.setSelected(!this.getSelected());
      return true;
    }
  }
  return false;
};
