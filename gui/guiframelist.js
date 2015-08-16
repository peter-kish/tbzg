// Frame list class constructor
var GuiFrameList = function(rect, horizontal) {
  GuiFrame.prototype.constructor.call(this, rect);
  if (horizontal) {
    this.horizontal = horizontal;
  } else {
    this.horizontal = false;
  }
}

// The frame list class inherits the frame class
inherit(GuiFrameList, GuiFrame);

// Updates the frame list
GuiFrameList.prototype.update = function () {
  if (!this.visible) {
    return;
  }

  GuiFrame.prototype.update.call(this);

  var offset = 0;
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].positioning = GUI_POS_RELATIVE;
    if (this.horizontal) {
      // Align the children horizontally
      this.children[i].rect.x = offset
      this.children[i].rect.y = 0;
      if (this.children[i].rect.x + this.children[i].getWidth() > this.getWidth()) {
        this.children[i].hide();
      } else {
        this.children[i].show();
        offset += this.children[i].getWidth();
      }
    } else {
      // Align the children vertically
      this.children[i].rect.x = 0
      this.children[i].rect.y = offset;
      if (this.children[i].rect.y + this.children[i].getHeight() > this.getHeight()) {
        this.children[i].hide();
      } else {
        this.children[i].show();
        offset += this.children[i].getHeight();
      }
    }
  }
};
