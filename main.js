// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var simulation = new Simulation();

function onWindowResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  simulation.camera.width = canvas.width;
  simulation.camera.height = canvas.height;
}
window.addEventListener("resize", onWindowResize, false);

function clearScreen() {
	drawRect(0, 0, canvas.width, canvas.height, '#FFFFFF');
}

function render() {
  simulation.render();
}

function update() {
  simulation.update();
}

function main() {
  requestAnimationFrame(main);

  update();

	clearScreen();
  render();
}

main();
