// Draw a progress bar
function drawProgressBar(x, y, w, h, progress, color) {
	if (!color)
		color = '#FFFFFF';

	drawRect(x, y, w, h, '#000000')
	drawRect(x, y, w * progress, h, color)
}

function debugText(x, y, text) {
	drawText(x, y, text, "Arial", 10, "#FFFFFF", "", "left", "top");
}
