// Tileset class constructor
var Tileset = function(image, tw, th) {
  this.image = image;
  this.tileWidth = tw;
  this.tileHeight = th;
}

// Returns the number of tile columns
Tileset.prototype.getWidth = function () {
  return this.image.clientWidth;
};

// Returns the number of tile rows
Tileset.prototype.getHeight = function () {
  return this.image.clientHeight;
};

// Draws the given tile at the given coordinates
Tileset.prototype.drawTile = function (tile, destination) {
  drawImageCropped(this.image,
    tile.x * this.tileWidth,
    tile.y * this.tileHeight,
    this.tileWidth,
    this.tileHeight,
    destination.x,
    destination.y,
    this.tileWidth,
    this.tileHeight);
};
