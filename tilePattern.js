// tilePattern class constructor
var TilePattern = function(w, h) {
  this.pattern = create2dArray(w, h);
  this.tiles = create2dArray(w, h);
  this.overwrite = true;
}

// Returns the pattern width
TilePattern.prototype.getWidth = function () {
  return this.pattern.length;
};

// Returns the pattern height
TilePattern.prototype.getHeight = function () {
  return this.pattern[0].length;
};

// Checks if the pattern fits on the given map at the given coordinates
TilePattern.prototype.checkMap = function (map, position) {
  for (var i = 0; i < this.getWidth(); i++) {
    for (var j = 0; j < this.getHeight(); j++) {
      if (position.x + i < map.length && position.y + j < map[0].length) {
        if (map[position.x + i][position.y + j] != this.pattern[i][j]) {
          return false;
        }
      }
    }
  }
  return true;
};

// Checks if the pattern would overwrite any existing tiles in the tilemap
TilePattern.prototype.overwrites = function (tilemap, position) {
  for (var i = 0; i < this.getWidth(); i++) {
    for (var j = 0; j < this.getHeight(); j++) {
      if (this.tiles[i][j]) {
        if (position.x + i < tilemap.length && position.y + j < tilemap[0].length) {
          if (tilemap[position.x + i][position.y + j]) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

// Apply the pattern to the given tilemap at the given position
TilePattern.prototype.applyTiles = function (tilemap, position) {
  if (!this.overwrite && this.overwrites(tilemap, position))
    return;

  for (var i = 0; i < this.getWidth(); i++) {
    for (var j = 0; j < this.getHeight(); j++) {
      if (this.tiles[i][j]) {
        if (position.x + i < tilemap.length && position.y + j < tilemap[0].length) {
          if (!tilemap[position.x + i][position.y + j] || this.overwrite) {
            tilemap[position.x + i][position.y + j] = this.tiles[i][j];
          }
        }
      }
    }
  }
};

// Checks if the pattern fits and applies it to the given tilemap at the given position
TilePattern.prototype.checkAndApply = function (map, tilemap, position) {
  if (this.checkMap(map, position)) {
    this.applyTiles(tilemap, position);
  }
};

// Applies the pattern to the whole tilemap based on the given map
TilePattern.prototype.generateTileMap = function (map, tilemap) {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[0].length; j++) {
      this.checkAndApply(map, tilemap, new Vector2d(i, j));
    }
  }
};
