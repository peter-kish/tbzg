var ga_inventory_selected_item = null;

function ga_clear_children(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function ga_reload() {
  getGameInstance().simulation.player.reload();

  ga_update_weapon_icons();
  ga_update_inventory();
}

function ga_skip_turn() {
  getGameInstance().simulation.player.doNothing();
}

function ga_clear_inventory() {
  var parentNode = document.getElementById('guiInventoryItemList');
  ga_clear_children(parentNode);
}

function ga_create_inventory_item_div(item) {
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
  ga_inventory_selected_item = this.item;

  // First unselect all items
  var inventoryItemList = document.getElementById("guiInventoryItemList");
  for (var i = 0; i < inventoryItemList.children.length; i++) {
    var itemDiv = inventoryItemList.children[i];
    itemDiv.style.border = "";
  }

  // Select the clicked item
  this.style.border = "2px solid #ffcf00";
  document.getElementById("guiInventoryItemName").innerHTML = this.item.name;
  document.getElementById("guiInventoryItemDesc").innerHTML = this.item.description;
  if (this.item.damage) {
    document.getElementById("guiInventoryItemDamage").innerHTML = "Damage: " + this.item.damage.hitPoints;
  } else {
    document.getElementById("guiInventoryItemDamage").innerHTML = "";
  }
  if (this.item.isStackable()) {
    document.getElementById("guiInventoryItemCount").innerHTML = "Count: " + this.item.count + "/" + this.item.maxCount;
  } else {
    document.getElementById("guiInventoryItemCount").innerHTML = "";
  }
}

function ga_update_inventory() {
  ga_clear_inventory();

  ga_add_inventory_item(getGameInstance().simulation.player.rangedSlot);
  ga_add_inventory_item(getGameInstance().simulation.player.meleeSlot);

  var item_array = getGameInstance().simulation.player.inventory.items;
  for (var i = 0; i < item_array.length; i++) {
    ga_add_inventory_item(item_array[i]);
  }
}

function ga_open_inventory() {
  ga_update_inventory();
  document.getElementById('guiToolbar').style.visibility='hidden';
  document.getElementById('guiMeleeSlot').style.visibility='hidden';
  document.getElementById('guiRangedSlot').style.visibility='hidden';
  document.getElementById('guiInventoryOverlay').style.visibility='visible';
}

function ga_close_inventory() {
  document.getElementById('guiToolbar').style.visibility='visible';
  document.getElementById('guiMeleeSlot').style.visibility='visible';
  document.getElementById('guiRangedSlot').style.visibility='visible';
  document.getElementById('guiInventoryOverlay').style.visibility='hidden';
  ga_inventory_selected_item = null;
}

function ga_update_weapon_icons() {
  ga_clear_children(document.getElementById("guiMeleeSlot"));
  ga_clear_children(document.getElementById("guiRangedSlot"));
  var meleeSlotDiv = ga_create_inventory_item_div(getGameInstance().simulation.player.meleeSlot);
  var rangedSlotDiv = ga_create_inventory_item_div(getGameInstance().simulation.player.rangedSlot);
  rangedSlotDiv.onclick = ga_reload;
  document.getElementById("guiMeleeSlot").appendChild(meleeSlotDiv);
  document.getElementById("guiRangedSlot").appendChild(rangedSlotDiv);
}

function ga_update_gui() {
  ga_update_inventory();
  ga_update_weapon_icons();
}

function ga_onload() {
  ga_update_weapon_icons();
  ga_close_inventory();
  document.getElementById("myCanvas").addEventListener('click', ga_on_canvas_click, false);
}

function ga_on_canvas_click(e) {
  ga_update_gui();
}
