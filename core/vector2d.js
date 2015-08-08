// Vector2d class
var Vector2d = function(x, y) {
	this.x = x;
	this.y = y;
};

Vector2d.prototype.set = function (vector) {
	this.x = vector.x;
	this.y = vector.y;
};

Vector2d.prototype.add = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
};

Vector2d.prototype.sub = function(vector) {
	this.x -= vector.x;
	this.y -= vector.y;
};

Vector2d.prototype.multiply = function(scalar) {
	this.x *= scalar;
	this.y *= scalar;
};

Vector2d.prototype.dot = function(vector) {
	return (this.x * vector.x) + (this.y * vector.y);
}

Vector2d.prototype.length = function() {
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
}

Vector2d.prototype.distance = function(vector) {
	return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
}

Vector2d.prototype.chebyshevDistance = function(vector) {
  return Math.abs(this.x - vector.x) + Math.abs(this.y - vector.y);
}

Vector2d.prototype.projection = function(vector) {
	var result = new Vector2d(vector.x, vector.y);
	var scalar = (this.dot(vector)) / (Math.pow(vector.length(), 2));
	result.multiply(scalar);
	return result;
}

Vector2d.prototype.normalize = function() {
	this.multiply(1 / this.length());
};

Vector2d.prototype.toString = function(vector) {
	return '(' + this.x + ',' + this.y + ')';
}

Vector2d.prototype.draw = function(center) {
	drawLine(center.x, center.y, center.x + this.x, center.y + this.y, 3, '#000000')
}

Vector2d.prototype.copy = function() {
	return new Vector2d(this.x, this.y);
}

Vector2d.prototype.equals = function (vector) {
	return (this.x == vector.x && this.y == vector.y);
};

function v2dAdd(v1, v2) {
	var result = new Vector2d(v1.x, v1.y);
	result.add(v2);
	return result;
}

function v2dSub(v1, v2) {
	var result = new Vector2d(v1.x, v1.y);
	result.sub(v2);
	return result;
}

function v2dMultiply(v1, scalar) {
	var result = new Vector2d(v1.x, v1.y);
	result.multiply(scalar);
	return result;
}

function v2dDot(v1, v2) {
	var result = new Vector2d(v1.x, v1.y);
	result.dot(v2);
	return result;
}

function v2dDistance(v1, v2) {
	var result = new Vector2d(v1.x, v1.y);
	return result.distance(v2);
}

function v2dProjection(v1, v2) {
	return v1.projection(v2);
}

function v2dNormalized(v) {
	var result = new Vector2d(v.x, v.y);
	result.normalize();
	return result;
}

function v2dEqual(v1, v2) {
	return v1.equals(v2);
}
