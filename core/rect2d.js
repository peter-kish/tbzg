// Rectangle class
var Rect2d = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}

Rect2d.prototype.toString = function(rect) {
	return '(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ')';
}

Rect2d.prototype.area = function() {
    return this.width * this.height;
}
