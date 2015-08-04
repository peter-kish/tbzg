// Constants
var MAP_WIDTH = 64;
var MAP_HEIGHT = 64;

var GRID_COLOR = '#888888'

// Settings
var cfgDrawGrid = true;

// Variables
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mapFieldSize = 8;
var minMapFieldSize = 8;
var maxMapFieldSize = 64;
var mapFieldSizeStep = 8;

function onWindowResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", onWindowResize, false);

var tile_colors = [];
tile_colors[TILE_VOID] = '#FFFFFF';
tile_colors[TILE_WALL] = '#000000';
tile_colors[TILE_ROAD] = '#888888';
tile_colors[TILE_PAVEMENT] = '#BBBBBB';
tile_colors[TILE_GRASS] = '#00BB00';
tile_colors[TILE_HEDGE] = '#008800';

//Basic logger
var logging_enabled = true;
function LOG(string) {
	if (logging_enabled) {
		console.log(string);
	}
}

var map = new MapGen(MAP_WIDTH, MAP_HEIGHT);

function onClick() {
	map.generateMap();
}
canvas.addEventListener('click', onClick, false);

function onWheel(e) {
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	mapFieldSize += delta * mapFieldSizeStep;
	mapFieldSize = Math.max(minMapFieldSize, mapFieldSize);
	mapFieldSize = Math.min(maxMapFieldSize, mapFieldSize);
}
canvas.addEventListener('mousewheel', onWheel, false);

function rgbToHex(r, g, b) {
	return "rgb("+Math.round(r)+","+Math.round(g)+","+Math.round(b)+")";
}

function clearScreen() {
	drawRect(0, 0, canvas.width, canvas.height, '#FFFFFF');
}

function drawCanvasBorder() {
	drawRectOutline(0, 0, canvas.width, canvas.height, 1, '#000000');
}

function drawMapBorder(position) {
	drawRectOutline(position.x, position.y, map.width * mapFieldSize, map.height * mapFieldSize, 1, '#000000');
}

function drawMap(position) {
	for (var i = 0; i < map.width; i++) {
		for (var j = 0; j < map.height; j++) {
			drawRect(position.x + i * mapFieldSize, position.y + j * mapFieldSize, mapFieldSize, mapFieldSize, tile_colors[map.getField(i,j)]);
		}
	}
	if (cfgDrawGrid)
		drawMapGrid(position);
	drawMapBorder(position);
}

function drawMapGrid(position) {
	var text_size = 10 * mapFieldSize / 16;
	for (var i = 0; i < map.width; i++) {
		drawText(position.x + mapFieldSize / 2 + i * mapFieldSize, position.y - mapFieldSize / 2, i, 'Calibri', text_size, GRID_COLOR, '', 'center', 'middle');
		drawLine(position.x + i * mapFieldSize, position.y, position.x + i * mapFieldSize, position.y + MAP_HEIGHT * mapFieldSize, 1, GRID_COLOR);
	}
	for (var i = 0; i < map.height; i++) {
		drawText(position.x - mapFieldSize / 2, position.y + mapFieldSize / 2 + i * mapFieldSize, i, 'Calibri', text_size, GRID_COLOR, '', 'center', 'middle');
		drawLine(position.x, position.y + i * mapFieldSize, position.x + MAP_WIDTH * mapFieldSize, position.y + i * mapFieldSize, 1, GRID_COLOR);
	}
}

function main() {
	clearScreen();
	//drawCanvasBorder();

	var mapPosition = new Vector2d(mapFieldSize, mapFieldSize);

	drawMap(mapPosition);
}

map.generateMap();

setInterval(main, 10);
