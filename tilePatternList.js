// Constants
var TILE_INVALID = -1;
var TILE_INTERIOR = 0;
var TILE_WALL = 1;
var TILE_ROAD = 2;
var TILE_PAVEMENT = 3;
var TILE_GRASS = 4;
var TILE_HEDGE = 5;

// The pattern list
var tilePatternList = [];
var newTP = null;

// All the patterns

// Interior
newTP = new TilePattern(1, 1);
newTP.pattern[0][0] = TILE_INTERIOR;
newTP.tiles[0][0] = new Vector2d(8, 0);
tilePatternList.push(newTP);

// Walls
newTP = new TilePattern(1, 1);
newTP.pattern[0][0] = TILE_WALL;
newTP.tiles[0][0] = new Vector2d(5, 0);
tilePatternList.push(newTP);

newTP = new TilePattern(1, 2);
newTP.pattern[0][0] = TILE_WALL;
newTP.pattern[0][1] = TILE_INTERIOR;
newTP.tiles[0][0] = new Vector2d(6, 0);
newTP.tiles[0][1] = new Vector2d(8, 0);
tilePatternList.push(newTP);

newTP = new TilePattern(1, 2);
newTP.pattern[0][0] = TILE_WALL;
newTP.pattern[0][1] = TILE_PAVEMENT;
newTP.tiles[0][0] = new Vector2d(6, 0);
newTP.tiles[0][1] = new Vector2d(3, 0);
tilePatternList.push(newTP);

// Grass
newTP = new TilePattern(1, 1);
newTP.pattern[0][0] = TILE_GRASS;
newTP.tiles[0][0] = new Vector2d(0, 1);
tilePatternList.push(newTP);

// Hedge
newTP = new TilePattern(1, 1);
newTP.pattern[0][0] = TILE_HEDGE;
newTP.tiles[0][0] = new Vector2d(1, 1);
tilePatternList.push(newTP);

newTP = new TilePattern(1, 2);
newTP.pattern[0][0] = TILE_HEDGE;
newTP.pattern[0][1] = TILE_GRASS;
newTP.tiles[0][0] = new Vector2d(2, 1);
newTP.tiles[0][1] = new Vector2d(0, 1);
tilePatternList.push(newTP);

newTP = new TilePattern(1, 2);
newTP.pattern[0][0] = TILE_HEDGE;
newTP.pattern[0][1] = TILE_PAVEMENT;
newTP.tiles[0][0] = new Vector2d(2, 1);
newTP.tiles[0][1] = new Vector2d(3, 0);
tilePatternList.push(newTP);

// Pavement
newTP = new TilePattern(1, 1);
newTP.pattern[0][0] = TILE_PAVEMENT;
newTP.tiles[0][0] = new Vector2d(3, 0);
tilePatternList.push(newTP);

newTP = new TilePattern(1, 2);
newTP.pattern[0][0] = TILE_PAVEMENT;
newTP.pattern[0][1] = TILE_ROAD;
newTP.tiles[0][0] = new Vector2d(4, 0);
newTP.tiles[0][1] = new Vector2d(0, 0);
tilePatternList.push(newTP);

// Roads
newTP = new TilePattern(1, 1);
newTP.pattern[0][0] = TILE_ROAD;
newTP.tiles[0][0] = new Vector2d(0, 0);
newTP.overwrite = false;
tilePatternList.push(newTP);
