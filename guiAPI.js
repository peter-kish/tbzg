var ga_inventory_selected_item = null;

function ga_clear_children(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function ga_reload() {
  getGameInstance().simulation.player.reload();

  ga_update_gui();
}

function ga_reload_selected_item() {
  if (!ga_inventory_selected_item) {
    return;
  }

  getGameInstance().simulation.player.reload(ga_inventory_selected_item);
  ga_update_gui();
}

function ga_extract_selected_item() {
  if (!ga_inventory_selected_item) {
    return;
  }

  getGameInstance().simulation.player.extractAmmo(ga_inventory_selected_item);
  ga_update_gui();
}

function ga_equip_selected_item() {
  if (!ga_inventory_selected_item) {
    return;
  }

  getGameInstance().simulation.player.equip(ga_inventory_selected_item);
  ga_update_gui();
}

function ga_discard_selected_item() {
  if (!ga_inventory_selected_item) {
    return;
  }

  getGameInstance().simulation.player.discardItem(ga_inventory_selected_item);
  ga_inventory_select_item(null);
  ga_update_gui();
}

function ga_skip_turn() {
  getGameInstance().simulation.player.doNothing();
}

function ga_clear_inventory() {
  var parentNode = document.getElementById('guiInventoryItemList');
  ga_clear_children(parentNode);
}

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

function ga_add_inventory_item(item) {
  if (!item) {
    return;
  }

  var newDiv = ga_create_inventory_item_div(item);
  newDiv.onclick = ga_on_inventory_item_click;
  document.getElementById('guiInventoryItemList').appendChild(newDiv);
}

function ga_on_inventory_item_click() {
  ga_inventory_select_item(this.item);
}

function ga_inventory_select_item(item) {
  ga_inventory_selected_item = item;

  if (!item) {
    document.getElementById("guiInventoryItemName").innerHTML = "";
    document.getElementById("guiInventoryItemDesc").innerHTML = "";
    document.getElementById("guiInventoryItemDamage").innerHTML = "";
    document.getElementById("guiInventoryItemCount").innerHTML = "";
    return;
  }

  var inventoryItemList = document.getElementById("guiInventoryItemList");
  var divToSelect = null;
  for (var i = 0; i < inventoryItemList.children.length; i++) {
    // Unselect everything
    var itemDiv = inventoryItemList.children[i];
    itemDiv.className = "inventoryItem";
    // Get the div for the given item
    if (item == itemDiv.item) {
      divToSelect = itemDiv;
    }
  }

  if (!divToSelect) {
    return;
  }

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

function ga_update_inventory() {
  ga_clear_inventory();

  var item_array = getGameInstance().simulation.player.inventory.items;
  for (var i = 0; i < item_array.length; i++) {
    ga_add_inventory_item(item_array[i]);
  }

  ga_inventory_select_item(ga_inventory_selected_item);
}

function ga_open_inventory() {
  ga_update_inventory();
  document.getElementById('guiToolbar').style.visibility='hidden';
  document.getElementById('guiMeleeSlot').style.visibility='hidden';
  document.getElementById('guiRangedSlot').style.visibility='hidden';
  document.getElementById('guiInventoryOverlay').style.visibility='visible';

  document.getElementById("guiInventoryItemName").innerHTML = "";
  document.getElementById("guiInventoryItemDesc").innerHTML = "";
  document.getElementById("guiInventoryItemCount").innerHTML = "";
  document.getElementById("guiInventoryItemDamage").innerHTML = "";
}

function ga_close_inventory() {
  document.getElementById('guiToolbar').style.visibility='visible';
  document.getElementById('guiMeleeSlot').style.visibility='visible';
  document.getElementById('guiRangedSlot').style.visibility='visible';
  document.getElementById('guiInventoryOverlay').style.visibility='hidden';
}

function ga_is_inventory_open() {
  var element = document.getElementById('guiInventoryOverlay');
  return element.style.visibility=='visible';
}

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

function ga_update_gui() {
  ga_update_inventory();
  ga_update_weapon_icons();
}

function ga_onload() {
  getGameInstance().guiOpenInventory = ga_open_inventory;
  getGameInstance().guiCloseInventory = ga_close_inventory;
  getGameInstance().guiIsInventoryOpen = ga_is_inventory_open;
  getGameInstance().guiUpdate = ga_update_gui;
  ga_update_weapon_icons();
  ga_close_inventory();
}
