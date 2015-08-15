//Constants
var GUI_POS_RELATIVE = 0;
var GUI_POS_ABSOLUTE = 1;
var GUI_POS_FLOAT_RIGHT = 2;
var GUI_POS_FLOAT_LEFT = 3;
var GUI_POS_FLOAT_TOP = 4;
var GUI_POS_FLOAT_BOTTOM = 5;
var GUI_POS_FLOAT_TOP_RIGHT = 6;
var GUI_POS_FLOAT_BOTTOM_RIGHT = 7;
var GUI_POS_FLOAT_TOP_LEFT = 8;
var GUI_POS_FLOAT_BOTTOM_LEFT = 9;

// Frame class constructor
var GuiFrame = function (rect) {
  this.rect = new Rect2d(rect.x, rect.y, rect.width, rect.height);
  this.children = [];
  this.parentFrame = null;
  this.onMouseClick = null;
  this.visible = true;
  this.positioning = GUI_POS_RELATIVE;
}

// Returns the frame screen position
GuiFrame.prototype.getScreenPosition = function () {
  var result = new Vector2d(this.rect.x, this.rect.y);

  if (!this.parentFrame) {
    // Ignore positioning. Only absolute is possible.
    return result;
  }

  switch (this.positioning) {
  case GUI_POS_RELATIVE:
    break;
  case GUI_POS_ABSOLUTE:
    return result;
    break;
  case GUI_POS_FLOAT_RIGHT:
    result.x = this.parentFrame.rect.width - this.rect.width;
    break;
  case GUI_POS_FLOAT_TOP_RIGHT:
    result.x = this.parentFrame.rect.width - this.rect.width;
    result.y = 0;
    break;
  case GUI_POS_FLOAT_BOTTOM_RIGHT:
    result.x = this.parentFrame.rect.width - this.rect.width;
    result.y = this.parentFrame.rect.height - this.rect.height;
    break;
  case GUI_POS_FLOAT_LEFT:
    result.x = 0;
    break;
  case GUI_POS_FLOAT_TOP_LEFT:
    result.x = 0;
    result.y = 0;
    break;
  case GUI_POS_FLOAT_BOTTOM_LEFT:
    result.x = 0;
    result.y = this.parentFrame.rect.height - this.rect.height;
    break;
  }

  result.add(this.parentFrame.getScreenPosition());
  return result;
};

// Renders the frame and all its children
GuiFrame.prototype.render = function () {
  if (this.visible) {
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].visible) {
        this.children[i].render();
      }
    }
  }
};

// Updates the frame and all its children.
GuiFrame.prototype.update = function () {
  if (this.visible) {
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].visible) {
        this.children[i].update();
      }
    }
  }
};

// Adds a child frame
GuiFrame.prototype.addChild = function (childFrame) {
  if (childFrame) {
    this.children.push(childFrame);
    childFrame.parentFrame = this;
  }
};

// Removes a child frame
GuiFrame.prototype.removeChild = function (childFrame) {
  for (var i = 0; i < this.children.length; i++) {
    if(this.children[i] == childFrame) {
      childFrame.parentFrame = null;
      this.children.splice(i, 1);
      return;
    }
  }
};

// Removes all children
GuiFrame.prototype.clearChildren = function () {
  this.children = [];
};

// Sets the frame visibility
GuiFrame.prototype.setVisibility  = function (visible) {
  this.visible = visible;
};

// Makes the frame visible
GuiFrame.prototype.show = function () {
  this.setVisibility(true);
};

// Hides the frame
GuiFrame.prototype.hide = function () {
  this.setVisibility(false);
};

// Handles the mouse input
GuiFrame.prototype.handleMouseClick = function (x, y) {
  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i].handleMouseClick(x, y)) {
      return true;
    }
  }

  var screenPos = this.getScreenPosition();
  if (x > screenPos.x && x < screenPos.x + this.rect.width) {
    if (y > screenPos.y && y < screenPos.y + this.rect.height) {
      if (this.onMouseClick) {
        this.onMouseClick();
        return true;
      }
    }
  }
  return false;
};
