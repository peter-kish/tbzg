// Global game instance
var game_instance = null;

function getGameInstance() {
  return game_instance;
}

// Game class constructor
var Game = function (scrWidth, scrHeight) {
  this.simulation = new Simulation();
  this.scrWidth = scrWidth;
  this.scrHeight = scrHeight;
  this.updateGUI = null;

  this.simulation.input.addHandler(inputHandler, this);

  game_instance = this;
}

// Render the game
Game.prototype.render = function () {
  this.simulation.render();
};

// Clear the screen
Game.prototype.clearScreen = function () {
  drawRect(0, 0, this.scrWidth, this.scrHeight, '#000000');
};

// Draw the loading screen
Game.prototype.drawLoadingScreen = function () {
  if (this.simulation) {
    drawProgressBar(this.scrWidth / 2 - 100, this.scrHeight / 2 - 8, 200, 16, this.simulation.resourceManager.getProgress(), "#888888");
    drawRectOutline(this.scrWidth / 2 - 100, this.scrHeight / 2 - 8, 200, 16, 1, "#888888")
  }
};

// Update the game
Game.prototype.update = function () {
  this.simulation.update();
};

// The main loop
Game.prototype.mainLoop = function () {
  if (this.simulation.resourceManager.loaded()) {
    this.update();

  	this.clearScreen();
    this.render();
  } else {
    this.clearScreen();
    this.drawLoadingScreen();
  }
};

// Initialize the GUI elements
Game.prototype.initGui = function () {
  var hud = this.initGui_hud();
  var inventory = this.initGui_inventory();

  this.gui.mainFrame.addChild(hud);
  this.gui.mainFrame.addChild(inventory);
};

Game.prototype.initGui_hud = function () {
  var toolbar = this.initGui_toolbar();
  var button_ranged_slot = new GuiInventoryItemButton(new Rect2d(this.scrWidth - 64, this.scrHeight - 32, 64, 32),
    this.simulation.player.rangedSlot, handleWeaponIcon);
  button_ranged_slot.positioning = GUI_POS_FLOAT_BOTTOM_RIGHT;
  var button_melee_slot = new GuiInventoryItemButton(new Rect2d(0, this.scrHeight - 32, 64, 32),
    this.simulation.player.meleeSlot, null);
  button_melee_slot.positioning = GUI_POS_FLOAT_BOTTOM_LEFT;

  var hud = new GuiFrame(new Rect2d(0, 0, this.scrWidth, this.scrHeight));
  hud.name = "gui_hud";
  hud.dimensions = GUI_DIM_FLOOD;

  hud.addChild(toolbar);
  hud.addChild(button_ranged_slot);
  hud.addChild(button_melee_slot);

  return hud;
};

Game.prototype.initGui_toolbar = function () {
  var toolbar = new GuiFrame(new Rect2d(0, 0, 96, 32));
  var button_skip_turn = new GuiImageButton(new Rect2d(64, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_skip_turn"),
    function(ge) {game_instance.simulation.player.doNothing();});
  var button_inventory = new GuiImageButton(new Rect2d(32, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_inventory"),
    function(ge) {game_instance.openInventory()});
  var button_menu = new GuiImageButton(new Rect2d(0, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_menu"),
    function(ge) {alert("Main menu not yet implemented.")});
  toolbar.addChild(button_skip_turn);
  toolbar.addChild(button_inventory);
  toolbar.addChild(button_menu);
  toolbar.positioning = GUI_POS_FLOAT_TOP_RIGHT;

  return toolbar;
};

Game.prototype.initGui_inventory = function () {
  var inventory = new GuiFrame(new Rect2d(0, 0, this.scrWidth, this.scrHeight));
  inventory.name = "gui_inventory"
  inventory.dimensions = GUI_DIM_FLOOD;
  inventory.hide();
  var inv_window = new GuiPanel(new Rect2d(0, 0, 256, 320));
  inv_window.positioning = GUI_POS_FLOAT_CENTER;
  var inv_title = new GuiText(new Rect2d(0, 0, 256, 32), "Inventory WIP");

  var inv_item_list = new GuiInventoryItemList(new Rect2d(0, 32, 64, 256));
  inv_item_list.addInventoryItem(this.simulation.player.meleeSlot, handleInventoryListItem);
  inv_item_list.addInventoryItem(this.simulation.player.rangedSlot, handleInventoryListItem);
  for (var i = 0; i < this.simulation.player.inventory.items.length; i++) {
    inv_item_list.addInventoryItem(this.simulation.player.inventory.items[i], handleInventoryListItem);
  }
  inv_item_list.name = "gui_inventory_item_list";

  var inv_item_stats = new GuiFrameList(new Rect2d(72, 32, 240, 256));
  var inv_text_item_name = new GuiText(new Rect2d(0, 0, 176, 32), "");
  inv_text_item_name.align = "center";
  inv_text_item_name.name = "gui_inventory_txt_item_name";
  inv_text_item_name.style = "bold";
  var inv_text_item_damage = new GuiText(new Rect2d(0, 0, 176, 32), "");
  inv_text_item_damage.align = "left";
  inv_text_item_damage.name = "gui_inventory_txt_item_damage";
  var inv_text_item_reload = new GuiText(new Rect2d(0, 0, 176, 32), "");
  inv_text_item_reload.align = "left";
  inv_text_item_reload.name = "gui_inventory_txt_item_reload";
  var inv_text_item_description = new GuiText(new Rect2d(0, 0, 176, 32), "");
  inv_text_item_description.align = "left";
  inv_text_item_description.name = "gui_inventory_txt_item_description";

  var inv_button_close = new GuiTextButton(new Rect2d(4, 292, 248, 26),
    "Close",
    null,
    function(ge) {game_instance.closeInventory()});
  inv_button_close.color = "#888888";

  inv_item_stats.addChild(inv_text_item_name);
  inv_item_stats.addChild(inv_text_item_damage);
  inv_item_stats.addChild(inv_text_item_reload);
  inv_item_stats.addChild(inv_text_item_description);
  inv_window.addChild(inv_title);
  inv_window.addChild(inv_item_list);
  inv_window.addChild(inv_item_stats);
  inv_window.addChild(inv_button_close);
  inventory.addChild(inv_window);

  return inventory;
};

// Gets called when an item is selected in the inventory
function handleInventoryListItem(item) {
  if (item) {
    var inv_txt_item_name = game_instance.gui.getElement("gui_inventory_txt_item_name");
    var inv_txt_item_description = game_instance.gui.getElement("gui_inventory_txt_item_description");
    var inv_txt_item_damage = game_instance.gui.getElement("gui_inventory_txt_item_damage");
    var inv_txt_item_reload = game_instance.gui.getElement("gui_inventory_txt_item_reload");
    inv_txt_item_name.text = item.name;
    inv_txt_item_description.text = item.description;
    inv_txt_item_damage.text = "Damage: ";
    if (item.damage) {
      inv_txt_item_damage.text += item.damage.hitPoints;
    } else {
      inv_txt_item_damage.text += "N/A"
    }
    inv_txt_item_reload.text = "Reload: ";
    if (item.slowReload) {
      inv_txt_item_reload.text += "slow";
    } else {
      inv_txt_item_reload.text += "fast";
    }
  }
}

// Gets called when the weapon icon is clicked on the HUD
function handleWeaponIcon(guiElement) {
  game_instance.simulation.player.reload();
}

// Opens the inventory screen
Game.prototype.openInventory = function () {
  // TODO: Check if this needs to be removed
};

// Closes the inventory screen
Game.prototype.closeInventory = function () {
  // TODO: Check if this needs to be removed
};

// Checks if the inventory screen is open
Game.prototype.isInventoryOpen = function () {
  // TODO: Check if this needs to be removed
};

// Input handler
function inputHandler(input, game, x, y) {
  switch (input) {
  case INPUT_LEFT:
    game.simulation.player.walkAttack(CHR_DIR_LEFT);
    break;
  case INPUT_UP:
    game.simulation.player.walkAttack(CHR_DIR_UP);
    break;
  case INPUT_RIGHT:
    game.simulation.player.walkAttack(CHR_DIR_RIGHT);
    break;
  case INPUT_DOWN:
    game.simulation.player.walkAttack(CHR_DIR_DOWN);
    break;
  case INPUT_SKIP:
    game.simulation.player.doNothing();
    break;
  case INPUT_RELOAD:
    game.simulation.player.reload();
    break;
  case INPUT_INVENTORY:
    if (game.isInventoryOpen()) {
      game.closeInventory();
    } else {
      game.openInventory();
    }
    break;
  case INPUT_CLICK:
    game.simulation.onFieldClick(game.simulation.getMapCoords(new Vector2d(x + game.simulation.camera.x, y + game.simulation.camera.y)));
    break;
  }
}

// Adjust to the new screen size
Game.prototype.onWindowResize = function (newWidth, newHeight) {
  this.scrWidth = newWidth;
  this.scrHeight = newHeight;
  this.simulation.onWindowResize(newWidth, newHeight);
};
