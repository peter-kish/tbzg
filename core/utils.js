// Create a 2d array
function create2dArray(a, b) {
	a = a > 0 ? a : 0;
    var arr = [];

    while(a--) {
        arr.push([]);
    }

    return arr;
}

// Returns a random number in range [min, max]
function getRandomIndex(min, max)
{
	return min + Math.floor(Math.random() * (max - min));
}

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
