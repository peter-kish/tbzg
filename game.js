// Global game instance
var game_instance = null;

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
  var button_skip_turn = new GuiImageButton(new Rect2d(canvas.width - 32, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_skip_turn"),
    function() {game_instance.simulation.player.doNothing();});
  var button_inventory = new GuiImageButton(new Rect2d(canvas.width - 64, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_inventory"),
    function() {alert("Inventory not yet implemented.");});
  var button_menu = new GuiImageButton(new Rect2d(canvas.width - 96, 0, 32, 32),
    this.simulation.resourceManager.getResource("button_menu"),
    function() {alert("Main menu not yet implemented.")});
  this.gui.mainFrame.addChild(button_skip_turn);
  this.gui.mainFrame.addChild(button_inventory);
  this.gui.mainFrame.addChild(button_menu);
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
};
