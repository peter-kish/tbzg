// Global game instance
var game_instance = null;

function getGameInstance() {
  return game_instance;
}

// Game class constructor
var Game = function (scrWidth, scrHeight) {
  this.simulation = new Simulation();
  this.gui = new Gui(scrWidth, scrHeight);
  this.scrWidth = scrWidth;
  this.scrHeight = scrHeight;

  this.initGui();
  this.simulation.input.addHandler(inputHandler, this);

  game_instance = this;
}

// Render the game
Game.prototype.render = function () {
  this.simulation.render();
  this.gui.render();
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
  this.gui.update();
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
  var toolbar = new GuiFrame(new Rect2d(0, 0, 96, 32));
  var button_skip_turn = new GuiImageButton(new Rect2d(64, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_skip_turn"),
    function() {game_instance.simulation.player.doNothing();});
  var button_inventory = new GuiImageButton(new Rect2d(32, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_inventory"),
    function() {game_instance.openInventory()});
  var button_menu = new GuiImageButton(new Rect2d(0, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_menu"),
    function() {alert("Main menu not yet implemented.")});
  toolbar.addChild(button_skip_turn);
  toolbar.addChild(button_inventory);
  toolbar.addChild(button_menu);
  toolbar.positioning = GUI_POS_FLOAT_TOP_RIGHT;

  var button_ranged_slot = new GuiInventoryItemButton(new Rect2d(this.scrWidth - 64, this.scrHeight - 32, 64, 32),
    this.simulation.player.rangedSlot, reloadWeapon);
  button_ranged_slot.positioning = GUI_POS_FLOAT_BOTTOM_RIGHT;
  var button_melee_slot = new GuiInventoryItemButton(new Rect2d(0, this.scrHeight - 32, 64, 32),
    this.simulation.player.meleeSlot, reloadWeapon);
  button_melee_slot.positioning = GUI_POS_FLOAT_BOTTOM_LEFT;

  var hud = new GuiFrame(new Rect2d(0, 0, this.scrWidth, this.scrHeight));
  hud.name = "gui_hud";
  hud.dimensions = GUI_DIM_FLOOD;

  hud.addChild(toolbar);
  hud.addChild(button_ranged_slot);
  hud.addChild(button_melee_slot);

  var inventory = new GuiFrame(new Rect2d(0, 0, this.scrWidth, this.scrHeight));
  inventory.name = "gui_inventory"
  inventory.dimensions = GUI_DIM_FLOOD;
  inventory.hide();
  var inv_window = new GuiPanel(new Rect2d(0, 0, 250, 300));
  inv_window.positioning = GUI_POS_FLOAT_CENTER;
  var inv_title = new GuiText(new Rect2d(0, 0, 250, 50), "Inventory not implemented");
  var inv_list = new GuiInventoryItemList(new Rect2d(0, 50, 250, 200));
  inv_list.addInventoryItem(this.simulation.player.meleeSlot);
  inv_list.addInventoryItem(this.simulation.player.rangedSlot);
  var inv_button_close = new GuiTextButton(new Rect2d(10, 250, 230, 40),
    "Close",
    null,
    function() {game_instance.closeInventory()});
  inv_button_close.color = "#888888";
  inv_window.addChild(inv_title);
  inv_window.addChild(inv_list);
  inv_window.addChild(inv_button_close);
  inventory.addChild(inv_window);

  this.gui.mainFrame.addChild(hud);
  this.gui.mainFrame.addChild(inventory);
};

Game.prototype.openInventory = function () {
  var hud = this.gui.getElement("gui_hud");
  var inventory = this.gui.getElement("gui_inventory");

  if (hud && inventory) {
    hud.hide();
    inventory.show();
  }
};

Game.prototype.closeInventory = function () {
  var hud = this.gui.getElement("gui_hud");
  var inventory = this.gui.getElement("gui_inventory");

  if (hud && inventory) {
    inventory.hide();
    hud.show();
  }
};

Game.prototype.isInventoryOpen = function () {
  var inventory = this.gui.getElement("gui_inventory");

  if (inventory) {
    return inventory.visible;
  }
  return false;
};

function reloadWeapon() {
  game_instance.simulation.player.reload();
}

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
    if (!game.gui.handleMouseClick(x, y))
      game.simulation.onFieldClick(game.simulation.getMapCoords(new Vector2d(x + game.simulation.camera.x, y + game.simulation.camera.y)));
    break;
  }
}

// Adjust to the new screen size
Game.prototype.onWindowResize = function (newWidth, newHeight) {
  this.scrWidth = newWidth;
  this.scrHeight = newHeight;
  this.simulation.onWindowResize(newWidth, newHeight);
  this.gui.mainFrame.rect.width = newWidth;
  this.gui.mainFrame.rect.height = newHeight;
};
