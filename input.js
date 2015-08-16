// All possible inputs
var INPUT_NONE = -1;
var INPUT_UP = 0;
var INPUT_DOWN = 1;
var INPUT_LEFT = 2;
var INPUT_RIGHT = 3;
var INPUT_SKIP = 4;
var INPUT_RELOAD = 5;
var INPUT_INVENTORY = 6;
var INPUT_CLICK = 7;

// Minimum swipe distance
var INPUT_MIN_SWIPE_DISTANCE = 8;

var canvas = document.getElementById('myCanvas');

var lastInput; // TODO: Make multiple input instances possible

// Input class constructor
var Input = function() {
  this.handlers = [];
  this.params = [];
  lastInput = this;
}

// Add an input hanler
Input.prototype.addHandler = function (f, p) {
  this.handlers.push(f);
  this.params.push(p);
};

// Clear all input handlers
Input.prototype.clearHandlers = function () {
  this.handlers = [];
  this.params = [];
};

//Keyboard inputs

window.addEventListener('keydown', function(event) {
  if (lastInput.handlers.length == 0)
    return;

  var input = INPUT_NONE;
  switch (event.keyCode) {
    case 37: // Left arrow
    case 65: // 'A'
      input = INPUT_LEFT;
      break;
    case 38: // Up arrow
    case 87: // 'W'
      input = INPUT_UP;
      break;
    case 39: // Right arrow
    case 68: // 'D'
      input = INPUT_RIGHT;
      break;
    case 40: // Down arrow
    case 83: // 'S'
      input = INPUT_DOWN;
      break;
    case 32: // Space
      input = INPUT_SKIP;
      break;
    case 82: // 'R'
      input = INPUT_RELOAD;
      break;
    case 73: // 'I'
      input = INPUT_INVENTORY;
      break;
    }

  for (var i = 0; i < lastInput.handlers.length; i++) {
    lastInput.handlers[i](input, lastInput.params[i]);
  }
});

// Mouse inputs

canvas.addEventListener('click', handleMouseClick, false);

function handleMouseClick(e) {
  input = INPUT_CLICK;

  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  }
  else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  for (var i = 0; i < lastInput.handlers.length; i++) {
    lastInput.handlers[i](input, lastInput.params[i], x, y);
  }
}

// Touchscreen inputs

window.addEventListener('touchstart', handleTouchStart, false);
window.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    var input = INPUT_NONE;

    if (Math.sqrt(xDiff * xDiff + yDiff * yDiff) < INPUT_MIN_SWIPE_DISTANCE) {
      input = INPUT_SKIP;
    } else {
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
          if ( xDiff > 0 ) {
            input = INPUT_LEFT;
          } else {
            input = INPUT_RIGHT;
          }
      } else {
          if ( yDiff > 0 ) {
            input = INPUT_UP;
          } else {
            input = INPUT_DOWN;
          }
      }
    }

    /* reset values */
    xDown = null;
    yDown = null;

    for (var i = 0; i < lastInput.handlers.length; i++) {
      lastInput.handlers[i](input, lastInput.params[i]);
    }
};
