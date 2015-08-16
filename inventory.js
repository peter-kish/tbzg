// InventoryItem class constructor
var InventoryItem = function (name, image) {
  this.name = name;
  this.description = null;
  this.image = image;
  this.count = 1;
  this.maxCount = 1;
  this.onUse = null;
}

// Returns true if the item is stackable
InventoryItem.prototype.isStackable = function () {
  return this.maxCount > 1;
};

// Returns true if the item is usable
InventoryItem.prototype.isUsable = function () {
  return this.onUse;
};

// Use the item (if usable)
InventoryItem.prototype.use = function ( ) {
  if (this.onUse)
    this.onUse();
};

// Returns true if the item is a weapon
InventoryItem.prototype.isWeapon = function () {
  return false;
};

// Equip the item (if it's a weapon)
InventoryItem.prototype.equip = function () {
  return false;
};

// Consumes the given amount of a stackable item
InventoryItem.prototype.consume = function (amount) {
  if (!amount) {
    amount = 1;
  }

  if (this.isStackable()) {
    if (this.count >= amount) {
      this.count -= amount;
      return true;
    }
  }

  return false;
};

// WeaponInventoryItem class constructor
var WeaponInventoryItem = function (name, image, damage, ammo, maxAmmo) {
  InventoryItem.prototype.constructor.call(this, name, image);
  this.damage = damage;
  this.count = ammo;
  this.maxCount = maxAmmo;
  this.ammoName = null;
  this.slowReload = false;
}

// WeaponInventoryItem class inherits the InventoryItem class
inherit(WeaponInventoryItem, InventoryItem);

// Returns true if the weapon is a weapon (Duh!)
WeaponInventoryItem.prototype.isWeapon = function () {
  return true;
};

// Returns the amount of ammo left in the weapon
WeaponInventoryItem.prototype.getAmmo = function () {
  return this.count;
};

// Reloads the given amount of ammo
WeaponInventoryItem.prototype.reload = function (amount) {
  if (this.isStackable()) {
    if (!amount) {
      amount = this.maxCount - this.count;
    }

    if (this.count <= this.maxCount - amount) {
      this.count += amount;
    }
  }
};

// Inventory class constructor
var Inventory = function (capacity) {
  this.items = [];
  if (capacity) {
    this.capacity = capacity;
  } else {
    this.capacity = 10;
  }
}

// Adds the given item to the inventory
Inventory.prototype.addItem = function (item) {
  if (this.items.length < this.capacity) {
    this.items.push(item);
    return true;
  } else {
    return false;
  }
};

// Removes the given item from the inventory
Inventory.prototype.removeItem = function (item) {
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i] == item) {
      this.items.splice(i, 1);
      return true;
    }
  }
  return false;
};


// Inventory item button class constructor
var GuiInventoryItemButton = function (rect, item, onClickCallback) {
  GuiImageButton.prototype.constructor.call(this, rect, item.image, onClickCallback);
  this.item = item;
  this.guiText = new GuiText(new Rect2d(0, 0, rect.width, rect.height), "0/0");
  this.guiText.align = "left";
  this.guiText.baseline = "top";
  this.guiText.size = 10;
  this.guiText.style = "bold";
  this.addChild(this.guiText);
  this.guiText.onMouseClick = this.onMouseClick;
}

// Inventory item button inherits the image button class
inherit(GuiInventoryItemButton, GuiImageButton);

// Updates the inventory item button
GuiInventoryItemButton.prototype.update = function () {
  GuiImageButton.prototype.update.call(this);
  if (this.item.isStackable()) {
    this.guiText.show();
    this.guiText.text = "" + this.item.count + "/" + this.item.maxCount;
  } else {
    this.guiText.hide();
  }
};

// Inventory item list class constructor
var GuiInventoryItemList = function (rect) {
  GuiFrameList.prototype.constructor.call(this, rect, false);
  this.selectedItem = null;
}

// Inventory item list class inherits the frame list class
inherit(GuiInventoryItemList, GuiFrameList);

// Unselects all children (assuming all children are selectable frames)
GuiInventoryItemList.prototype.unselectAll = function () {
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].setSelected(false);
  }
};

// Returns the currently selected inventory item (assuming all children contain inventory item buttons)
GuiInventoryItemList.prototype.getSelectedItem = function () {
  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i].getSelected()) {
      return this.children[i].children[0].item;
    }
  }

  return false;
};

// Handles a mouse click
GuiInventoryItemList.prototype.handleMouseClick = function (x, y) {
  if (!this.visible) {
    return false;
  }

  var screenRect = this.getScreenRect();
  var result = false;
  if (x > screenRect.x && x < screenRect.x + screenRect.width) {
    if (y > screenRect.y && y < screenRect.y + screenRect.height) {
      this.unselectAll();
      result = GuiFrameList.prototype.handleMouseClick.call(this, x, y);
      this.selectedItem = this.getSelectedItem();
      return result;
    }
  }
  return false;
};

// Adds the given inventory item to the list
GuiInventoryItemList.prototype.addInventoryItem = function (item) {
  var newFrame = new GuiSelectableFrame(new Rect2d(0, 0, 64, 32));
  var newButton = new GuiInventoryItemButton(new Rect2d(0, 0, 64, 32), item, function(){});
  newFrame.addChild(newButton);
  this.addChild(newFrame);
};
