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
  if (this.count <= this.maxCount - amount) {
    this.count += amount;
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
