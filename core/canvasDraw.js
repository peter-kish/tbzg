// Drawing functions
var drawRatio = 1.0;

function drawLine(x1, y1, x2, y2, width, color) {
	x1 *= drawRatio;
	y1 *= drawRatio;
	x2 *= drawRatio;
	y2 *= drawRatio;
	width *= drawRatio;
	
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineWidth = width;
	context.strokeStyle = color;
	context.stroke();
}

function drawCircle(x, y, r, color) {
	x *= drawRatio;
	y *= drawRatio;
	r *= drawRatio;
	
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
}

function drawCircleOutline(x, y, r, width, color) {
	x *= drawRatio;
	y *= drawRatio;
	r *= drawRatio;
	width *= drawRatio;
	
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI, false);
	context.lineWidth = width;
	context.strokeStyle = color;
	context.stroke();
}

function drawRect(x, y, w, h, color) {
	x *= drawRatio;
	y *= drawRatio;
	w *= drawRatio;
	h *= drawRatio;
	
	context.beginPath();
	context.rect(x, y, w, h);
	context.fillStyle = color;
	context.fill();
}

function drawRectOutline(x, y, w, h, lineWidth, color) {
	x *= drawRatio;
	y *= drawRatio;
	w *= drawRatio;
	h *= drawRatio;
	
	context.beginPath();
	context.rect(x, y, w, h);
	context.lineWidth = lineWidth;
	context.strokeStyle = color;
	context.stroke();
}

function drawText(x, y, text, font, fontSize, color, style, align, baseline) {
	x *= drawRatio;
	y *= drawRatio;
	fontSize *= drawRatio;
	
	context.font = style + ' ' + fontSize + 'pt ' + font;
	context.fillStyle = color;
	context.textAlign = align;
	context.textBaseline = baseline;
	context.fillText(text, x, y);
}