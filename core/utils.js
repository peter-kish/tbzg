function inherit(derived, base) {
	derived.prototype = Object.create(base.prototype);
	derived.prototype.constructor = derived;
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

// Returns a random number in range [min, max]
function getRandomIndex(min, max)
{
	return min + Math.floor(Math.random() * (max - min));
}
