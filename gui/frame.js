// Frame class constructor
var Frame = function (rect) {
  this.rect = new Rect2d(rect.x, rect.y, rect.width, rect.height);
  this.children = [];
  this.parentFrame = null;
  this.onMouseClick = null;
}

// Returns the frame screen position
Frame.prototype.getScreenPosition = function () {
  if (this.parentFrame) {
    var delta = this.parentFrame.getScreenPosition();
    return new Vector2d(this.rect.x + delta.x, this.rect.y + delta.y);
  } else {
    return new Vector2d(this.rect.x, this.rect.y);
  }
};

// Renders the frame and all its children
Frame.prototype.render = function () {
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].render();
  }
};

// Updates the frame and all its children. Returns true if mouse input has been handled.
Frame.prototype.update = function () {
  var mouseHandled = false;
  for (var i = 0; i < this.children.length; i++) {
    mouseHandled = this.children[i].update();
  }
  if (!mouseHandled && this.onMouseClick) {
    this.onMouseClick();
    return true;
  }
  return false;
};

// Adds a child frame
Frame.prototype.addChild = function (childFrame) {
  if (childFrame) {
    this.children.push(childFrame);
    childFrame.parentFrame = this;
  }
};

// Removes a child frame
Frame.prototype.removeChild = function (childFrame) {
  for (var i = 0; i < this.children.length; i++) {
    if(this.children[i] == childFrame) {
      childFrame.parentFrame = null;
      this.children.splice(i, 1);
      return;
    }
  }
};

// Removes all children
Frame.prototype.clearChildren = function () {
  this.children = [];
};
