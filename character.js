var CHR_DIR_LEFT = 0;
var CHR_DIR_RIGHT = 1;
var CHR_DIR_UP = 2;
var CHR_DIR_DOWN = 3;
var CHR_DIR_INVALID = 4;

var CHR_ST_IDLE = 0;
var CHR_ST_MOVE = 1;
var CHR_ST_ATTACK = 2
var CHR_ST_TURN_END = 3

var CHR_WALK_SPEED = 150;
var CHR_ATTACK_SPEED = 150;

var Character = function(parentSim, position) {
  this.position = new Vector2d(position.x, position.y);
  this.prevPosition = new Vector2d(position.x, position.y);
  this.parentSim = parentSim;
  this.stateMachine = new FuzzyStateMachine(CHR_ST_IDLE);
  this.facing = CHR_DIR_RIGHT;
  this.color = '#1839c8';
}

Character.prototype.render = function () {
  var screenPosition = this.getWorldPosition();
  screenPosition.sub(this.parentSim.getCameraPosition());
  drawRect(screenPosition.x, screenPosition.y, 32, 32, this.color);
};

Character.prototype.update = function () {
  if (this.isInSolidState(CHR_ST_MOVE) || this.isInSolidState(CHR_ST_ATTACK)) {
    this.stateMachine.setState(CHR_ST_TURN_END, 0);
  }
};

Character.prototype.getAdjacentField = function (direction) {
  switch (direction) {
    case CHR_DIR_LEFT:
      return new Vector2d(this.position.x - 1, this.position.y);
      break;
    case CHR_DIR_RIGHT:
      return new Vector2d(this.position.x + 1, this.position.y);
      break;
    case CHR_DIR_UP:
      return new Vector2d(this.position.x, this.position.y - 1);
      break;
    case CHR_DIR_DOWN:
      return new Vector2d(this.position.x, this.position.y + 1);
      break;
    default:
    return new Vector2d(this.position.x, this.position.y);
  }
};

Character.prototype.walk  = function (direction) {
  if (this.isInSolidState(CHR_ST_IDLE)) {
    return this.move(direction, CHR_WALK_SPEED);
  } else {
    return false;
  }
};

Character.prototype.move = function (direction, speed) {
  var targetField = this.getAdjacentField(direction);

  this.prevPosition = this.position.copy();
  if (this.parentSim.isFreeField(targetField)) {
    this.position.set(targetField);
  } else {
    return false;
  }

  this.stateMachine.setState(CHR_ST_MOVE, speed);
  return true;
};

Character.prototype.attack = function (position, direction) {
  if (this.isInSolidState(CHR_ST_IDLE)) {
    var character = this.parentSim.getCharacterAt(position);
    if (!character)
      return false;

    if (this.parentSim.isFreeField(character.getAdjacentField(direction)))
      character.move(direction, CHR_WALK_SPEED);
    this.stateMachine.setState(CHR_ST_ATTACK, CHR_ATTACK_SPEED);
    return true;
  }
  return false;
};

Character.prototype.walkAttack = function (direction) {
  var attackPosition = this.getAdjacentField(direction);
  var character = this.parentSim.getCharacterAt(attackPosition);
  if (character) {
    this.attack(attackPosition, direction);
  } else {
    this.walk(direction);
  }
};

Character.prototype.getWorldPosition = function () {
if (this.isInState(CHR_ST_MOVE)) {
    var prevPosition = this.parentSim.getWorldCoords(this.prevPosition);
    var position = this.parentSim.getWorldCoords(this.position);
    var worldPos = v2dSub(position, prevPosition);
    worldPos.multiply(this.stateMachine.fader.getEasing(EasingFunctions.easeOutQuad));
    worldPos.add(prevPosition);
    return worldPos;
  } else {
    return this.parentSim.getWorldCoords(this.position);
  }
};

Character.prototype.getDirection = function (position) {
  for (var i = 0; i < CHR_DIR_INVALID; i++) {
    if (position.equals(this.getAdjacentField(i))) {
      return i;
    }
  }
  return CHR_DIR_INVALID;
};

Character.prototype.isInState = function (state) {
  return this.stateMachine.getState() == state;
};

Character.prototype.isInSolidState = function (state) {
  return (this.stateMachine.getState() == state && !this.stateMachine.isInTransition());
};

Character.prototype.translatesToState = function (state) {
  return (this.stateMachine.getState() == state && this.stateMachine.isInTransition());
};

Character.prototype.isTurnFinished = function () {
  return this.isInSolidState(CHR_ST_TURN_END);
};

Character.prototype.takeTurn = function () {
  this.stateMachine.setState(CHR_ST_IDLE, 0);
};

Character.prototype.doNothing = function () {
  this.stateMachine.setState(CHR_ST_TURN_END, 0);
};

var AI = function(parentSim, position) {
  this.position = new Vector2d(position.x, position.y);
  this.prevPosition = new Vector2d(position.x, position.y);
  Character.prototype.constructor.call(this, parentSim, position);
  this.color = '#8519a4';
  this.playerSeenPosition = null;
}

AI.prototype = Object.create(Character.prototype);
AI.prototype.constructor = AI;

AI.prototype.update = function() {
  Character.prototype.update.call(this);
  if (this.isInSolidState(CHR_ST_IDLE)) {
    var stepsToPlayer = this.getStepsToPlayer();
    if (stepsToPlayer < 5 && stepsToPlayer > 1) {
      if (this.parentSim.testVisibility(this.position, this.parentSim.player.position)) {
        this.playerSeenPosition = new Vector2d(this.parentSim.player.position.x, this.parentSim.player.position.y);
        //this.walkTo(this.parentSim.player.position);
        //return;
      }
    } else if (stepsToPlayer == 1) {
      var direction = this.getDirection(this.parentSim.player.position);
      this.attack(this.parentSim.player.position, direction);
      return;
    }

    if (this.playerSeenPosition && !this.playerSeenPosition.equals(this.position)) {
      this.walkTo(this.parentSim.player.position);
      return;
    }

    this.doNothing();
  }
}

/*AI.prototype.render = function () {
  Character.prototype.render.call(this);
  if (this.playerSeenPosition) {
    var screenPosition = v2dMultiply(this.playerSeenPosition, this.parentSim.mapFieldSize);
    screenPosition.sub(this.parentSim.getCameraPosition());
    drawRectOutline(screenPosition.x+8, screenPosition.y+8, 16, 16, 1, this.color);
  }
};*/

AI.prototype.walkTo = function (position) {
  var dx = this.position.x - this.parentSim.player.position.x;
  var dy = this.position.y - this.parentSim.player.position.y;
  var moved = false;
  if (Math.abs(dx) > Math.abs(dy)) {
    if(dx < 0) {
      moved = this.walk(CHR_DIR_RIGHT);
    } else {
      moved = this.walk(CHR_DIR_LEFT);
    }
  }
  if (!moved) {
    if(dy < 0) {
      moved = this.walk(CHR_DIR_DOWN);
    } else {
      moved = this.walk(CHR_DIR_UP);
    }
  }
  if (!moved) {
    if(dx < 0) {
      moved = this.walk(CHR_DIR_RIGHT);
    } else {
      moved = this.walk(CHR_DIR_LEFT);
    }
  }
  if (!moved)
    this.doNothing();
  return moved;
};

// Returns the Chebyshev distance (not Euclidean)
AI.prototype.getStepsToPlayer = function() {
  var dx = Math.abs(this.position.x - this.parentSim.player.position.x);
  var dy = Math.abs(this.position.y - this.parentSim.player.position.y);
  return dx + dy;
}
