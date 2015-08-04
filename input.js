var INPUT_NONE = -1;
var INPUT_UP = 0;
var INPUT_DOWN = 1;
var INPUT_LEFT = 2;
var INPUT_RIGHT = 3;
var INPUT_SKIP = 4;

var INPUT_MIN_SWIPE_DISTANCE = 8;

var canvas = document.getElementById('myCanvas');

var lastInput; // TODO: Make multiple inputs instances possible

var Input = function() {
  this.handlers = [];
  this.params = [];
  lastInput = this;
}

Input.prototype.addHandler = function (f, p) {
  this.handlers.push(f);
  this.params.push(p);
};

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
    case 37: // Left
      input = INPUT_LEFT;
      break;
    case 38: // Up
      input = INPUT_UP;
      break;
    case 39: // Right
      input = INPUT_RIGHT;
      break;
    case 40: // Down
      input = INPUT_DOWN;
      break;
    case 32: // Space
      input = INPUT_SKIP;
      break;
    }

  for (var i = 0; i < lastInput.handlers.length; i++) {
    lastInput.handlers[i](input, lastInput.params[i]);
  }
});

// Mouse inputs

canvas.addEventListener('click', handleMouseClick, false);

function handleMouseClick(e) {
  input = INPUT_SKIP;

  for (var i = 0; i < lastInput.handlers.length; i++) {
    lastInput.handlers[i](input, lastInput.params[i]);
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
