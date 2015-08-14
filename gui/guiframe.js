// Frame class constructor
var GuiFrame = function (rect) {
  this.rect = new Rect2d(rect.x, rect.y, rect.width, rect.height);
  this.children = [];
  this.parentFrame = null;
  this.onMouseClick = null;
  this.visible = true;
}

// Returns the frame screen position
GuiFrame.prototype.getScreenPosition = function () {
  if (this.parentFrame) {
    var delta = this.parentFrame.getScreenPosition();
    return new Vector2d(this.rect.x + delta.x, this.rect.y + delta.y);
  } else {
    return new Vector2d(this.rect.x, this.rect.y);
  }
};

// Renders the frame and all its children
GuiFrame.prototype.render = function () {
  if (this.visible) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].render();
    }
  }
};

// Updates the frame and all its children. Returns true if mouse input has been handled.
GuiFrame.prototype.update = function () {
  if (this.visible) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].update();
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
      }
      return true;
    }
  }
  return false;
};
