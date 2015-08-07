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
newTP.tiles[0][1] = null;
tilePatternList.push(newTP);

// Roads
newTP = new TilePattern(5, 2);
newTP.pattern[0][0] = TILE_PAVEMENT;
newTP.pattern[1][0] = TILE_ROAD;
newTP.pattern[2][0] = TILE_ROAD;
newTP.pattern[3][0] = TILE_ROAD;
newTP.pattern[4][0] = TILE_PAVEMENT;
newTP.pattern[0][1] = TILE_PAVEMENT;
newTP.pattern[1][1] = TILE_ROAD;
newTP.pattern[2][1] = TILE_ROAD;
newTP.pattern[3][1] = TILE_ROAD;
newTP.pattern[4][1] = TILE_PAVEMENT;
newTP.tiles[0][0] = null;
newTP.tiles[1][0] = new Vector2d(0, 0);
newTP.tiles[2][0] = new Vector2d(2, 0);
newTP.tiles[3][0] = new Vector2d(0, 0);
newTP.tiles[4][0] = null;
newTP.tiles[0][1] = null;
newTP.tiles[1][1] = new Vector2d(0, 0);
newTP.tiles[2][1] = new Vector2d(0, 0);
newTP.tiles[3][1] = new Vector2d(0, 0);
newTP.tiles[4][1] = null;
newTP.overwrite = false;
tilePatternList.push(newTP);

newTP = new TilePattern(2, 5);
newTP.pattern[0][0] = TILE_PAVEMENT;
newTP.pattern[0][1] = TILE_ROAD;
newTP.pattern[0][2] = TILE_ROAD;
newTP.pattern[0][3] = TILE_ROAD;
newTP.pattern[0][4] = TILE_PAVEMENT;
newTP.pattern[1][0] = TILE_PAVEMENT;
newTP.pattern[1][1] = TILE_ROAD;
newTP.pattern[1][2] = TILE_ROAD;
newTP.pattern[1][3] = TILE_ROAD;
newTP.pattern[1][4] = TILE_PAVEMENT;
newTP.tiles[0][0] = null;
newTP.tiles[0][1] = new Vector2d(0, 0);
newTP.tiles[0][2] = new Vector2d(1, 0);
newTP.tiles[0][3] = new Vector2d(0, 0);
newTP.tiles[0][4] = null;
newTP.tiles[1][0] = null;
newTP.tiles[1][1] = new Vector2d(0, 0);
newTP.tiles[1][2] = new Vector2d(0, 0);
newTP.tiles[1][3] = new Vector2d(0, 0);
newTP.tiles[1][4] = null;
newTP.overwrite = false;
tilePatternList.push(newTP);

newTP = new TilePattern(7, 2);
newTP.pattern[0][0] = TILE_PAVEMENT;
newTP.pattern[1][0] = TILE_ROAD;
newTP.pattern[2][0] = TILE_ROAD;
newTP.pattern[3][0] = TILE_ROAD;
newTP.pattern[4][0] = TILE_ROAD;
newTP.pattern[5][0] = TILE_ROAD;
newTP.pattern[6][0] = TILE_PAVEMENT;
newTP.pattern[0][1] = TILE_PAVEMENT;
newTP.pattern[1][1] = TILE_ROAD;
newTP.pattern[2][1] = TILE_ROAD;
newTP.pattern[3][1] = TILE_ROAD;
newTP.pattern[4][1] = TILE_ROAD;
newTP.pattern[5][1] = TILE_ROAD;
newTP.pattern[6][1] = TILE_PAVEMENT;
newTP.tiles[0][0] = null;
newTP.tiles[1][0] = new Vector2d(0, 0);
newTP.tiles[2][0] = new Vector2d(0, 0);
newTP.tiles[3][0] = new Vector2d(2, 0);
newTP.tiles[4][0] = new Vector2d(0, 0);
newTP.tiles[5][0] = new Vector2d(0, 0);
newTP.tiles[6][0] = null;
newTP.tiles[0][1] = null;
newTP.tiles[1][1] = new Vector2d(0, 0);
newTP.tiles[2][1] = new Vector2d(0, 0);
newTP.tiles[3][1] = new Vector2d(0, 0);
newTP.tiles[4][1] = new Vector2d(0, 0);
newTP.tiles[5][1] = new Vector2d(0, 0);
newTP.tiles[6][1] = null;
newTP.overwrite = false;
tilePatternList.push(newTP);

newTP = new TilePattern(2, 7);
newTP.pattern[0][0] = TILE_PAVEMENT;
newTP.pattern[0][1] = TILE_ROAD;
newTP.pattern[0][2] = TILE_ROAD;
newTP.pattern[0][3] = TILE_ROAD;
newTP.pattern[0][4] = TILE_ROAD;
newTP.pattern[0][5] = TILE_ROAD;
newTP.pattern[0][6] = TILE_PAVEMENT;
newTP.pattern[1][0] = TILE_PAVEMENT;
newTP.pattern[1][1] = TILE_ROAD;
newTP.pattern[1][2] = TILE_ROAD;
newTP.pattern[1][3] = TILE_ROAD;
newTP.pattern[1][4] = TILE_ROAD;
newTP.pattern[1][5] = TILE_ROAD;
newTP.pattern[1][6] = TILE_PAVEMENT;
newTP.tiles[0][0] = null;
newTP.tiles[0][1] = new Vector2d(0, 0);
newTP.tiles[0][2] = new Vector2d(0, 0);
newTP.tiles[0][3] = new Vector2d(1, 0);
newTP.tiles[0][4] = new Vector2d(0, 0);
newTP.tiles[0][5] = new Vector2d(0, 0);
newTP.tiles[0][6] = null;
newTP.tiles[1][0] = null;
newTP.tiles[1][1] = new Vector2d(0, 0);
newTP.tiles[1][2] = new Vector2d(0, 0);
newTP.tiles[1][3] = new Vector2d(0, 0);
newTP.tiles[1][4] = new Vector2d(0, 0);
newTP.tiles[1][5] = new Vector2d(0, 0);
newTP.tiles[1][6] = null;
newTP.overwrite = false;
tilePatternList.push(newTP);

newTP = new TilePattern(9, 2);
newTP.pattern[0][0] = TILE_PAVEMENT;
newTP.pattern[1][0] = TILE_ROAD;
newTP.pattern[2][0] = TILE_ROAD;
newTP.pattern[3][0] = TILE_ROAD;
newTP.pattern[4][0] = TILE_ROAD;
newTP.pattern[5][0] = TILE_ROAD;
newTP.pattern[6][0] = TILE_ROAD;
newTP.pattern[7][0] = TILE_ROAD;
newTP.pattern[8][0] = TILE_PAVEMENT;
newTP.pattern[0][1] = TILE_PAVEMENT;
newTP.pattern[1][1] = TILE_ROAD;
newTP.pattern[2][1] = TILE_ROAD;
newTP.pattern[3][1] = TILE_ROAD;
newTP.pattern[4][1] = TILE_ROAD;
newTP.pattern[5][1] = TILE_ROAD;
newTP.pattern[6][1] = TILE_ROAD;
newTP.pattern[7][1] = TILE_ROAD;
newTP.pattern[8][1] = TILE_PAVEMENT;
newTP.tiles[0][0] = null;
newTP.tiles[1][0] = new Vector2d(0, 0);
newTP.tiles[2][0] = new Vector2d(0, 0);
newTP.tiles[3][0] = new Vector2d(0, 0);
newTP.tiles[4][0] = new Vector2d(2, 0);
newTP.tiles[5][0] = new Vector2d(0, 0);
newTP.tiles[6][0] = new Vector2d(0, 0);
newTP.tiles[7][0] = new Vector2d(0, 0);
newTP.tiles[8][0] = null;
newTP.tiles[0][1] = null;
newTP.tiles[1][1] = new Vector2d(0, 0);
newTP.tiles[2][1] = new Vector2d(0, 0);
newTP.tiles[3][1] = new Vector2d(0, 0);
newTP.tiles[4][1] = new Vector2d(0, 0);
newTP.tiles[5][1] = new Vector2d(0, 0);
newTP.tiles[6][1] = new Vector2d(0, 0);
newTP.tiles[7][1] = new Vector2d(0, 0);
newTP.tiles[8][1] = null;
newTP.overwrite = false;
tilePatternList.push(newTP);

newTP = new TilePattern(2, 9);
newTP.pattern[0][0] = TILE_PAVEMENT;
newTP.pattern[0][1] = TILE_ROAD;
newTP.pattern[0][2] = TILE_ROAD;
newTP.pattern[0][3] = TILE_ROAD;
newTP.pattern[0][4] = TILE_ROAD;
newTP.pattern[0][5] = TILE_ROAD;
newTP.pattern[0][6] = TILE_ROAD;
newTP.pattern[0][7] = TILE_ROAD;
newTP.pattern[0][8] = TILE_PAVEMENT;
newTP.pattern[1][0] = TILE_PAVEMENT;
newTP.pattern[1][1] = TILE_ROAD;
newTP.pattern[1][2] = TILE_ROAD;
newTP.pattern[1][3] = TILE_ROAD;
newTP.pattern[1][4] = TILE_ROAD;
newTP.pattern[1][5] = TILE_ROAD;
newTP.pattern[1][6] = TILE_ROAD;
newTP.pattern[1][7] = TILE_ROAD;
newTP.pattern[1][8] = TILE_PAVEMENT;
newTP.tiles[0][0] = null;
newTP.tiles[0][1] = new Vector2d(0, 0);
newTP.tiles[0][2] = new Vector2d(0, 0);
newTP.tiles[0][3] = new Vector2d(0, 0);
newTP.tiles[0][4] = new Vector2d(1, 0);
newTP.tiles[0][5] = new Vector2d(0, 0);
newTP.tiles[0][6] = new Vector2d(0, 0);
newTP.tiles[0][7] = new Vector2d(0, 0);
newTP.tiles[0][8] = null;
newTP.tiles[1][0] = null;
newTP.tiles[1][1] = new Vector2d(0, 0);
newTP.tiles[1][2] = new Vector2d(0, 0);
newTP.tiles[1][3] = new Vector2d(0, 0);
newTP.tiles[1][4] = new Vector2d(0, 0);
newTP.tiles[1][5] = new Vector2d(0, 0);
newTP.tiles[1][6] = new Vector2d(0, 0);
newTP.tiles[1][7] = new Vector2d(0, 0);
newTP.tiles[1][8] = null;
newTP.overwrite = false;
tilePatternList.push(newTP);

newTP = new TilePattern(1, 1);
newTP.pattern[0][0] = TILE_ROAD;
newTP.tiles[0][0] = new Vector2d(0, 0);
newTP.overwrite = false;
tilePatternList.push(newTP);
