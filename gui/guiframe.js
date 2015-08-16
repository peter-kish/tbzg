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

var GUI_DIM_FIXED = 0;
var GUI_DIM_FLOOD = 1;
var GUI_DIM_CUTOFF = 1;

// Frame class constructor
var GuiFrame = function (rect) {
  this.rect = new Rect2d(rect.x, rect.y, rect.width, rect.height);
  this.children = [];
  this.parentFrame = null;
  this.onMouseClick = null;
  this.visible = true;
  this.positioning = GUI_POS_RELATIVE;
  this.dimensions = GUI_DIM_FIXED;
  this.name = "";
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
    result.x = this.parentFrame.getWidth() - this.getWidth();
    break;
  case GUI_POS_FLOAT_TOP_RIGHT:
    result.x = this.parentFrame.getWidth() - this.getWidth();
    result.y = 0;
    break;
  case GUI_POS_FLOAT_BOTTOM_RIGHT:
    result.x = this.parentFrame.getWidth() - this.getWidth();
    result.y = this.parentFrame.getHeight() - this.getHeight();
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
    result.y = this.parentFrame.getHeight() - this.getHeight();
    break;
  }

  result.add(this.parentFrame.getScreenPosition());
  return result;
};

// Returns the frame width on the screen
GuiFrame.prototype.getWidth = function () {
  if (!this.parentFrame || this.dimensions == GUI_DIM_FIXED) {
    return this.rect.width;
  }

  if (this.dimensions == GUI_DIM_FLOOD) {
    return this.parentFrame.getWidth() - this.rect.x;
  } else if (this.dimensions == GUI_DIM_CUTOFF) {
    if (this.rect.x + this.rect.width > this.parentFrame.getWidth()) {
      return this.parentFrame.getWidth() - this.rect.x;
    }
  }
};

// Returns the frame height on the screen
GuiFrame.prototype.getHeight = function () {
  if (!this.parentFrame || this.dimensions == GUI_DIM_FIXED) {
    return this.rect.height;
  }

  if (this.dimensions == GUI_DIM_FLOOD) {
    return this.parentFrame.getHeight() - this.rect.y;
  } else if (this.dimensions == GUI_DIM_CUTOFF) {
    if (this.rect.y + this.rect.height > this.parentFrame.getHeight()) {
      return this.parentFrame.getHeight() - this.rect.y;
    }
  }
};

// Returns the frame rectangle on the screen
GuiFrame.prototype.getScreenRect = function () {
  var pos = this.getScreenPosition();
  var w = this.getWidth();
  var h = this.getHeight();

  return new Rect2d(pos.x, pos.y, w, h);
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

  var screenRect = this.getScreenRect();
  if (x > screenRect.x && x < screenRect.x + screenRect.width) {
    if (y > screenRect.y && y < screenRect.y + screenRect.height) {
      if (this.onMouseClick) {
        this.onMouseClick();
        return true;
      }
    }
  }
  return false;
};

// Returns the GUI child element with the given name
GuiFrame.prototype.getElement = function (name) {
  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i].name == name) {
      return this.children[i];
    }
  }

  var element = null;
  for (var i = 0; i < this.children.length; i++) {
    element = this.children[i].getElement(name);
    if (element) {
      return element;
    }
  }

  return null;
};
