// Holds the currently selected item in the inventory
var ga_inventory_selected_item = null;

var ga_loot_inventory_1 = null;
var ga_loot_inventory_2 = null;
var ga_loot_selected_item = null;

// Removes all the element children
function ga_clear_children(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Reload
function ga_reload() {
  getGameInstance().simulation.player.reload();

  ga_update_gui();
}

// Reloads the currently selected item in the inventory
function ga_reload_selected_item() {
  if (!ga_inventory_selected_item) {
    return;
  }

  getGameInstance().simulation.player.reload(ga_inventory_selected_item);
  ga_update_gui();
}

// Extracts ammo from the currently selected item in the inventory
function ga_extract_selected_item() {
  if (!ga_inventory_selected_item) {
    return;
  }

  getGameInstance().simulation.player.extractAmmo(ga_inventory_selected_item);
  ga_update_gui();
}

// Equips the currently selected item in the inventory
function ga_equip_selected_item() {
  if (!ga_inventory_selected_item) {
    return;
  }

  getGameInstance().simulation.player.equip(ga_inventory_selected_item);
  ga_update_gui();
}

// Discards the currently selected item in the inventory
function ga_discard_selected_item() {
  if (!ga_inventory_selected_item) {
    return;
  }

  getGameInstance().simulation.player.discardItem(ga_inventory_selected_item);
  ga_inventory_select_item(null);
  ga_update_gui();
}

// Skips a turn
function ga_skip_turn() {
  getGameInstance().simulation.player.doNothing();
}

// Clears all inventory elements in the GUI
function ga_clear_inventory() {
  var parentNode = document.getElementById('guiInventoryItemList');
  ga_clear_children(parentNode);
}

// Creates a div for the given inventory item
function ga_create_inventory_item_div(item) {
  if (!item){
    return null;
  }

  var newDiv = document.createElement("div");
  var newP = document.createElement("p");
  var newImg = document.createElement("img");
  newImg.src = item.image.src;
  newDiv.appendChild(newImg);
  if (item.isStackable()) {
    var textNode = document.createTextNode("" + item.count + "/" + item.maxCount);
    newP.appendChild(textNode);
    newP.className = "inventoryItemCount";
    newDiv.appendChild(newP);
  }

  newDiv.item = item;
  newDiv.className = "inventoryItem";
  return newDiv;
}

// Selects the div containing the given item and return it
function ga_select_item_div(item, parentElement) {
  var divToSelect = null;
  for (var i = 0; i < parentElement.children.length; i++) {
    // Unselect everything
    var itemDiv = parentElement.children[i];
    itemDiv.className = "inventoryItem";
    // Get the div for the given item
    if (item == itemDiv.item) {
      divToSelect = itemDiv;
    }
  }

  if (divToSelect) {
    divToSelect.className = "inventoryItemSelected";
  }

  return divToSelect;
}

// Adds the given item to the inventory GUI
function ga_add_inventory_item(item) {
  if (!item) {
    return;
  }

  var newDiv = ga_create_inventory_item_div(item);
  newDiv.onclick = ga_on_inventory_item_click;
  document.getElementById('guiInventoryItemList').appendChild(newDiv);
}

// Handles a click on an inventory item
function ga_on_inventory_item_click() {
  ga_inventory_select_item(this.item);
}

// Selects the given item in the inventory
function ga_inventory_select_item(item) {
  if (!item) {
    document.getElementById("guiInventoryItemName").innerHTML = "";
    document.getElementById("guiInventoryItemDesc").innerHTML = "";
    document.getElementById("guiInventoryItemDamage").innerHTML = "";
    document.getElementById("guiInventoryItemCount").innerHTML = "";
    return;
  }

  var divToSelect = ga_select_item_div(item, document.getElementById("guiInventoryItemList"))

  if (!divToSelect) {
    return;
  }

  ga_inventory_selected_item = item;
  document.getElementById("guiInventoryButtonReload").disabled = !(item.isWeapon() && item.isStackable() && item.count < item.maxCount);
  document.getElementById("guiInventoryButtonExtract").disabled = !(item.isWeapon() && item.isStackable() && item.count > 0);
  document.getElementById("guiInventoryButtonEquip").disabled = !item.isWeapon();
  document.getElementById("guiInventoryButtonDiscard").disabled = !item.discardable;

  // Select the given item
  divToSelect.className = "inventoryItemSelected";
  document.getElementById("guiInventoryItemName").innerHTML = item.name;
  document.getElementById("guiInventoryItemDesc").innerHTML = "Description: " + item.description;
  if (item.damage) {
    document.getElementById("guiInventoryItemDamage").innerHTML = "Damage: " + item.damage.hitPoints;
  } else {
    document.getElementById("guiInventoryItemDamage").innerHTML = "";
  }
  if (item.isStackable()) {
    document.getElementById("guiInventoryItemCount").innerHTML = "Count: " + item.count + "/" + item.maxCount;
  } else {
    document.getElementById("guiInventoryItemCount").innerHTML = "";
  }
}

// Updates the inventory GUI
function ga_update_inventory() {
  ga_clear_inventory();

  var item_array = getGameInstance().simulation.player.inventory.items;
  for (var i = 0; i < item_array.length; i++) {
    ga_add_inventory_item(item_array[i]);
  }

  ga_inventory_select_item(ga_inventory_selected_item);
}

// Shows the inventory GUI
function ga_open_inventory() {
  ga_update_inventory();
  ga_set_HUD_visibility(false);
  document.getElementById('guiInventoryOverlay').style.visibility='visible';

  if (!ga_inventory_selected_item) {
    document.getElementById("guiInventoryItemName").innerHTML = "";
    document.getElementById("guiInventoryItemDesc").innerHTML = "";
    document.getElementById("guiInventoryItemCount").innerHTML = "";
    document.getElementById("guiInventoryItemDamage").innerHTML = "";
  }
}

// Hides the inventory GUI
function ga_close_inventory() {
  ga_set_HUD_visibility(true);
  document.getElementById('guiInventoryOverlay').style.visibility='hidden';
}

// Returns if the inventory GUI is visible
function ga_is_inventory_open() {
  var element = document.getElementById('guiInventoryOverlay');
  return element.style.visibility=='visible';
}

// Sets the HUD visibility
function ga_set_HUD_visibility(visible) {
  document.getElementById('guiToolbar').style.visibility=visible?'visible':'hidden';
  document.getElementById('guiMeleeSlot').style.visibility=visible?'visible':'hidden';
  document.getElementById('guiRangedSlot').style.visibility=visible?'visible':'hidden';
}

// Opens the loot dialog
function ga_open_loot_dialog(inventory1, inventory2) {
  ga_close_inventory();
  ga_set_HUD_visibility(false);
  document.getElementById('guiLootDialogOverlay').style.visibility='visible';
  ga_loot_inventory_1 = inventory1;
  ga_loot_inventory_2 = inventory2;
  ga_update_loot_dialog();
  ga_loot_selected_item = null;
}

// Closes the loot dialog
function ga_close_loot_dialog() {
  document.getElementById('guiLootDialogOverlay').style.visibility='hidden';
  ga_set_HUD_visibility(true);
  ga_loot_inventory_1 = null;
  ga_loot_inventory_2 = null;
}

// Updates the loot dialog
function ga_update_loot_dialog() {
  ga_clear_loot_dialog();

  if (ga_loot_inventory_1 && ga_loot_inventory_2) {
    var item_array = ga_loot_inventory_1.items;
    for (var i = 0; i < item_array.length; i++) {
      ga_add_loot_item(item_array[i], 1);
    }
    item_array = ga_loot_inventory_2.items;
    for (var i = 0; i < item_array.length; i++) {
      ga_add_loot_item(item_array[i], 2);
    }
  }
}

// Adds the given item to the loot dialog
function ga_add_loot_item(item, inv_num) {
  if (!item) {
    return;
  }

  var newDiv = ga_create_inventory_item_div(item);
  newDiv.onclick = ga_on_loot_item_click;
  if (inv_num == 1) {
    document.getElementById('guiLootItemList1').appendChild(newDiv);
  } else {
    document.getElementById('guiLootItemList2').appendChild(newDiv);
  }
}

// Handles a click on an item in the loot dialog
function ga_on_loot_item_click() {
  ga_loot_select_item(this.item);
}

// Selects the given item in the inventory
function ga_loot_select_item(item) {
  var divToSelect1 = ga_select_item_div(item, document.getElementById("guiLootItemList1"));
  var divToSelect2 = ga_select_item_div(item, document.getElementById("guiLootItemList2"));
  if (!divToSelect1 && !divToSelect2) {
    return;
  }
  ga_loot_selected_item = item;
}

// Transfers loot from right panel to the left
function ga_loot_transfer_to_1() {
  if (ga_loot_inventory_2.find(ga_loot_selected_item)) {
    ga_loot_inventory_2.transfer(ga_loot_selected_item, ga_loot_inventory_1);
    ga_update_loot_dialog();
  }
}

// Transfers loot from left panel to the right
function ga_loot_transfer_to_2() {
  if (ga_loot_inventory_1.find(ga_loot_selected_item)) {
    ga_loot_inventory_1.transfer(ga_loot_selected_item, ga_loot_inventory_2);
    ga_update_loot_dialog();
  }
}

// Clears all elements in the loot dialog
function ga_clear_loot_dialog() {
  ga_clear_children(document.getElementById('guiLootItemList1'));
  ga_clear_children(document.getElementById('guiLootItemList2'));
}

// Updates the weapon icons
function ga_update_weapon_icons() {
  ga_clear_children(document.getElementById("guiMeleeSlot"));
  ga_clear_children(document.getElementById("guiRangedSlot"));
  var meleeSlotDiv = ga_create_inventory_item_div(getGameInstance().simulation.player.meleeSlot);
  var rangedSlotDiv = ga_create_inventory_item_div(getGameInstance().simulation.player.rangedSlot);
  if (meleeSlotDiv) {
    document.getElementById("guiMeleeSlot").appendChild(meleeSlotDiv);
  }
  if (rangedSlotDiv) {
    rangedSlotDiv.onclick = ga_reload;
    document.getElementById("guiRangedSlot").appendChild(rangedSlotDiv);
  }
}

// Updates the GUI
function ga_update_gui() {
  ga_update_inventory();
  ga_update_weapon_icons();
  ga_update_loot_dialog();
}

// Initialize the GUI
function ga_onload() {
  getGameInstance().guiOpenInventory = ga_open_inventory;
  getGameInstance().guiCloseInventory = ga_close_inventory;
  getGameInstance().guiIsInventoryOpen = ga_is_inventory_open;
  getGameInstance().guiUpdate = ga_update_gui;
  getGameInstance().guiLoot = ga_open_loot_dialog;
  ga_update_weapon_icons();
  ga_close_inventory();
}
