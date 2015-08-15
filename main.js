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


// Get the canvas
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
// Use the whole window area for drawing
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create a new game instance
var game = new Game(canvas.width, canvas.height);

// Adjust the canvas size on resize
function onWindowResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (game)
    game.onWindowResize(canvas.width, canvas.height);
}
window.addEventListener("resize", onWindowResize, false);

// Main loop
function main() {
  requestAnimationFrame(main);

  game.mainLoop();
}

// Initial main() call
main();
