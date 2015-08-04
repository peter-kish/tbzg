// Constants
var TILE_INVALID = -1;
var TILE_VOID = 0;
var TILE_WALL = 1;
var TILE_ROAD = 2;
var TILE_PAVEMENT = 3;
var TILE_GRASS = 4;
var TILE_HEDGE = 5;

var PARK_MAX_AREA = 150;

// Returns a random number in range [min, max]
function getRandomIndex(min, max)
{
	return min + Math.floor(Math.random() * (max - min));
}

// Create a 2d array
function create2dArray(a, b) {
	a = a > 0 ? a : 0;
    var arr = [];

    while(a--) {
        arr.push([]);
    }

    return arr;
}

// MapGen class constructor
var MapGen = function(w, h) {
  this.width = w;
  this.height = h;
  this.map = create2dArray(w, h);
}

// Generate a map
MapGen.prototype.generateMap = function() {
	var mapRect = new Rect2d(0, 0, this.width, this.height);
	this.fill(mapRect, TILE_VOID);
	this.splitBlock(mapRect, 7);
}

MapGen.prototype.splitBlock = function(rect, lanes) {
	if (lanes > 1) {
		//LOG("Splitting " + rect);
		var horizontalSplit = ((rect.height - rect.width) > 0) ? true : false;
		var splitIndex;
		if (horizontalSplit) {
			splitIndex = getRandomIndex(rect.height / 4, 3 * rect.height / 4);
		} else {
			splitIndex = getRandomIndex(rect.width / 4, 3 * rect.width / 4);
		}

		this.generateRoad(rect, splitIndex, lanes, horizontalSplit);

		if (horizontalSplit) {
			var blockA = this.getFillRect(rect.x, rect.y);
			var blockB = this.getFillRect(rect.x, rect.y + rect.height - 1);
			this.splitBlock(blockA, lanes - 2);
			this.splitBlock(blockB, lanes - 2);
		} else {
			var blockA = this.getFillRect(rect.x, rect.y);
			var blockB = this.getFillRect(rect.x + rect.width - 1, rect.y);
			this.splitBlock(blockA, lanes - 2);
			this.splitBlock(blockB, lanes - 2);
		}
	} else {
		this.generateBlock(rect);
	}
}

MapGen.prototype.generateRoad = function(rect, position, lanes, horizontal) {
	this.fillLine(rect, position, lanes, horizontal, TILE_ROAD);
}

MapGen.prototype.generateBlock = function(rect) {
	var area = rect.area();
	this.fillBorder(rect, TILE_PAVEMENT);
	var innerRect = new Rect2d(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2);
	if (innerRect.width <= 4 || innerRect.height <= 4) {
		// Too small for anything... generate green area
		this.generateGreenArea(innerRect);
	} else if (area < PARK_MAX_AREA) {
		// For small blocks there is a 50% chance of creating a park
		if (Math.random() < 0.5) {
			this.generatePark(innerRect);
		} else {
			this.generateBuilding(innerRect);
		}
	} else {
		this.generateBuildingBlock(innerRect);
	}
}

MapGen.prototype.generatePark = function(rect) {
	this.generateGreenArea(rect);
	this.fillBorder(rect, TILE_HEDGE);
	// Generate 4 entrances
	this.map[Math.floor(rect.x + rect.width / 2)][Math.floor(rect.y)] = TILE_GRASS;
	this.map[Math.floor(rect.x + rect.width / 2)][Math.floor(rect.y + rect.height) - 1] = TILE_GRASS;
	this.map[Math.floor(rect.x)][Math.floor(rect.y + rect.height / 2)] = TILE_GRASS;
	this.map[Math.floor(rect.x + rect.width - 1)][Math.floor(rect.y + rect.height / 2)] = TILE_GRASS;
}

MapGen.prototype.generateGreenArea = function(rect) {
	this.fill(rect, TILE_GRASS);
}

MapGen.prototype.generateBuildingBlock = function(rect) {
	if (rect.width / rect.height >= 2.0) {
		// Small vertical split
		this.fillLine(rect, rect.width / 2, 1, false, TILE_PAVEMENT);
		this.generateBuildingBlock(this.getFillRect(rect.x, rect.y));
		this.generateBuildingBlock(this.getFillRect(rect.x + rect.width - 1, rect.y + rect.height - 1));
	} else if (rect.height / rect.width >= 2.0) {
		// Small horizontal split
		this.fillLine(rect, rect.height / 2, 1, true, TILE_PAVEMENT);
		this.generateBuildingBlock(this.getFillRect(rect.x, rect.y));
		this.generateBuildingBlock(this.getFillRect(rect.x + rect.width - 1, rect.y + rect.height - 1));
	} else {
		this.generateBuilding(rect);
	}
}

MapGen.prototype.generateBuilding = function(rect) {
	this.fillBorder(rect, TILE_WALL);
	// Generate an entrance on random side of the building
	var rand = getRandomIndex(0, 3);
	if (rand == 0) {
		this.map[Math.floor(rect.x + rect.width / 2)][Math.floor(rect.y)] = TILE_VOID;
	} else if (rand == 1) {
		this.map[Math.floor(rect.x + rect.width / 2)][Math.floor(rect.y + rect.height) - 1] = TILE_VOID;
	} else if (rand == 2) {
		this.map[Math.floor(rect.x)][Math.floor(rect.y + rect.height / 2)] = TILE_VOID;
	} else {
		this.map[Math.floor(rect.x + rect.width - 1)][Math.floor(rect.y + rect.height / 2)] = TILE_VOID;
	}
	//this.map[Math.floor(rect.x + rect.width / 2)][Math.floor(rect.y + rect.height) - 1] = TILE_VOID;
}

// Fill a rectangular area with the given field type
MapGen.prototype.fill = function(rect, field) {
	for (var i = rect.x; i < rect.x + rect.width; i++) {
		for (var j = rect.y; j < rect.y + rect.height; j++) {
			this.map[Math.floor(i)][Math.floor(j)] = field;
		}
	}
}

// Fill only the border of a rectangular area with the given field type
MapGen.prototype.fillBorder = function(rect, field) {
	for (var i = rect.x; i < rect.x + rect.width; i++) {
		this.map[Math.floor(i)][Math.floor(rect.y)] = field;
		this.map[Math.floor(i)][Math.floor(rect.y + rect.height) - 1] = field;
	}
	for (var j = rect.y; j < rect.y + rect.height; j++) {
		this.map[Math.floor(rect.x)][Math.floor(j)] = field;
		this.map[Math.floor(rect.x + rect.width) - 1][Math.floor(j)] = field;
	}
}

// Fill a horizontal or vertical line area with the given field type and width
MapGen.prototype.fillLine = function(rect, offset, width, horizontal, field) {
	var lineRect;
	if (horizontal) {
		lineRect = new Rect2d(rect.x, rect.y + offset - width / 2, rect.width, width);
	} else {
		lineRect = new Rect2d(rect.x + offset - width / 2, rect.y, width, rect.height);
	}
	this.fill(lineRect, field);
}

// Returns the rectangular area at the given coordinates
MapGen.prototype.getFillRect = function(x, y) {
  var field = this.map[x][y];
	var rect = new Rect2d(x, y, 0, 0);
	while(rect.x - 1 >= 0 && this.map[rect.x - 1][rect.y] == field)
	{
		rect.x--;
	}
	while(rect.x + rect.width + 1 < this.width && this.map[rect.x + rect.width + 1][rect.y] == field)
	{
		rect.width++;
	}

	while(rect.y - 1 >= 0 && this.map[rect.x][rect.y - 1] == field)
	{
		rect.y--;
	}
	while(rect.y + rect.height + 1 < this.height && this.map[rect.x][rect.y + rect.height + 1] == field)
	{
		rect.height++;
	}

	rect.width++;
	rect.height++;
	//LOG("mapGetFillRect(" + xIndex + ", " + yIndex + ") = " + rect);
	return rect;
}

// Returns the field type at the given coordinates
MapGen.prototype.getField = function(x, y) {
	if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
		return TILE_INVALID;
	} else {
		return this.map[x][y];
	}
}
