
var PrefabItemSet = function (sim) {
  this.items = {};
  this.parentSim = sim;

  this.initPrefabItems();
}

PrefabItemSet.prototype.initPrefabItems = function () {
  var newItem = null;

  newItem = new WeaponInventoryItem("Fists",
    this.parentSim.resourceManager.getResource("item_fists"),
    new Damage(DMG_MELEE, 1, true), 1, 1);
  newItem.description = "Your bare fists."
  newItem.discardable = false;
  this.addPrefabItem(newItem);

  newItem = new WeaponInventoryItem("Sawed-off shotgun",
    this.parentSim.resourceManager.getResource("item_shotgun"),
    new Damage(DMG_BULLET, 5, false), 2, 2);
  newItem.slowReload = true;
  newItem.description = "A 2 shot shotgun.";
  newItem.ammoName = "Shotgun shells"
  this.addPrefabItem(newItem);

  newItem = new WeaponInventoryItem("Handgun",
    this.parentSim.resourceManager.getResource("item_handgun"),
    new Damage(DMG_BULLET, 3, false), 15, 15);
  newItem.description = "A 9mm handgun.";
  newItem.ammoName = "9mm"
  this.addPrefabItem(newItem);

  newItem = new InventoryItem("Shotgun shells", this.parentSim.resourceManager.getResource("item_shotgun_shells"));
  newItem.count = 8;
  newItem.maxCount = 8;
  newItem.description = "Shotgun ammo."
  this.addPrefabItem(newItem);

  newItem = new InventoryItem("9mm", this.parentSim.resourceManager.getResource("item_9mm"));
  newItem.count = 15;
  newItem.maxCount = 15;
  newItem.description = "9mm ammo."
  this.addPrefabItem(newItem);

  var newItem = new WeaponInventoryItem("Zombie Fists",
    this.parentSim.resourceManager.getResource("item_fists"),
    new Damage(DMG_MELEE, 5, true), 1, 1);
  newItem.discardable = false;
  this.addPrefabItem(newItem);
};

PrefabItemSet.prototype.addPrefabItem = function (item) {
  this.items[item.name] = item;
};

PrefabItemSet.prototype.getPrefabItem = function (itemName) {
  return this.items[itemName];
};

PrefabItemSet.prototype.getPrefabItemInstance = function (itemName) {
  var item = this.getPrefabItem(itemName);
  if (item) {
    return item.clone();
  } else {
    return null;
  }
};
