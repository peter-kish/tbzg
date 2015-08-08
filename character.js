// Character directions
var CHR_DIR_LEFT = 0;
var CHR_DIR_RIGHT = 1;
var CHR_DIR_UP = 2;
var CHR_DIR_DOWN = 3;
var CHR_DIR_INVALID = 4;

// Character states
var CHR_ST_IDLE = 0;
var CHR_ST_MOVE = 1;
var CHR_ST_ATTACK = 2
var CHR_ST_TURN_END = 3

// State transition speeds (in ms)
var CHR_WALK_SPEED = 150;
var CHR_ATTACK_SPEED = 150;

// Character class constructor
var Character = function(parentSim, position) {
  this.position = new Vector2d(position.x, position.y);
  this.prevPosition = new Vector2d(position.x, position.y);
  this.parentSim = parentSim;
  this.stateMachine = new FuzzyStateMachine(CHR_ST_IDLE);
  this.facing = CHR_DIR_RIGHT;
  this.maxHitPoints = 15;
  this.hitPoints = this.maxHitPoints;
}

// Render the character
Character.prototype.render = function () {
  var screenPosition = this.getScreenPosition();
  if (this.isAlive()) {
    drawImage(this.image_idle, screenPosition.x, screenPosition.y, this.facing == CHR_DIR_LEFT, false);
  } else {
    drawImage(this.image_dead, screenPosition.x, screenPosition.y, this.facing == CHR_DIR_LEFT, false);
  }
};

// Update the character
Character.prototype.update = function () {
  if (this.isInSolidState(CHR_ST_MOVE) || this.isInSolidState(CHR_ST_ATTACK)) {
    this.stateMachine.setState(CHR_ST_TURN_END, 0);
  }
};

// Get the parameters of the given adjacent field
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

// Face to the given direction
Character.prototype.faceTo = function (direction) {
  if (direction == CHR_DIR_LEFT) {
    this.facing = CHR_DIR_LEFT;
  } else if (direction == CHR_DIR_RIGHT) {
    this.facing = CHR_DIR_RIGHT;
  }
};

// Walk in the given direction
Character.prototype.walk  = function (direction) {
  if (this.isInSolidState(CHR_ST_IDLE)) {
    this.faceTo(direction);

    return this.move(direction, CHR_WALK_SPEED);
  } else {
    return false;
  }
};

// Move in the given direction with the given speed (in ms)
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

// Attack in the given direction
Character.prototype.attack = function (position, direction) {
  if (this.isInSolidState(CHR_ST_IDLE)) {
    var character = this.parentSim.getCharacterAt(position);
    if (!character)
      return false;

    this.faceTo(direction);
    character.takeDamage(new Damage(DMG_MELEE, 5, true), direction);
    this.stateMachine.setState(CHR_ST_ATTACK, CHR_ATTACK_SPEED);
    return true;
  }
  return false;
};


// Apply the given damage on the character
Character.prototype.takeDamage = function (damage, direction) {
  this.hitPoints = Math.max(this.hitPoints - damage.hitPoints, 0);
  if (damage.knockback) {
    if (this.parentSim.isFreeField(this.getAdjacentField(direction)))
      this.move(direction, CHR_WALK_SPEED);
  }
};

Character.prototype.isAlive = function () {
  return this.hitPoints > 0;
};

// Attack or walk in the given direction, depending on the adjacent field
Character.prototype.walkAttack = function (direction) {
  var attackPosition = this.getAdjacentField(direction);
  var character = this.parentSim.getCharacterAt(attackPosition);
  if (character) {
    this.attack(attackPosition, direction);
  } else {
    this.walk(direction);
  }
};

// Returns the character position in the 2d world
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

Character.prototype.getScreenPosition = function () {
  var screenPosition = this.getWorldPosition();
  screenPosition.sub(this.parentSim.getCameraPosition());
  return screenPosition;
};

// Returns the direction of the given adjacent field
Character.prototype.getDirection = function (position) {
  for (var i = 0; i < CHR_DIR_INVALID; i++) {
    if (position.equals(this.getAdjacentField(i))) {
      return i;
    }
  }
  return CHR_DIR_INVALID;
};

// Checks if the character is in the given state
Character.prototype.isInState = function (state) {
  return this.stateMachine.getState() == state;
};

// Checks if the character is in the given solid state (the transition is finished)
Character.prototype.isInSolidState = function (state) {
  return (this.stateMachine.getState() == state && !this.stateMachine.isInTransition());
};

// Checks if the character is translating to the given state
Character.prototype.translatesToState = function (state) {
  return (this.stateMachine.getState() == state && this.stateMachine.isInTransition());
};

// Checks if the character has finished its turn
Character.prototype.isTurnFinished = function () {
  return this.isInSolidState(CHR_ST_TURN_END);
};

// Prepares the character for a new turn
Character.prototype.takeTurn = function () {
  this.stateMachine.setState(CHR_ST_IDLE, 0);
};

// Skip a turn
Character.prototype.doNothing = function () {
  this.stateMachine.setState(CHR_ST_TURN_END, 0);
};

// AI class constructor
var AI = function(parentSim, position) {
  this.position = new Vector2d(position.x, position.y);
  this.prevPosition = new Vector2d(position.x, position.y);
  Character.prototype.constructor.call(this, parentSim, position);
  this.playerSeenPosition = null;
  this.visionRange = 5;
}

// AI class inherits the Character class
AI.prototype = Object.create(Character.prototype);
AI.prototype.constructor = AI;

// Updates the AI
AI.prototype.update = function() {
  Character.prototype.update.call(this);
  if (this.isInSolidState(CHR_ST_IDLE)) {
    if (!this.isAlive()) {
      this.doNothing();
      return;
    }

    var stepsToPlayer = this.getStepsToPlayer();
    if (stepsToPlayer < this.visionRange && stepsToPlayer > 1) {
      // Remember the player location if he's in range
      if (this.parentSim.testVisibility(this.position, this.parentSim.player.position)) {
        this.playerSeenPosition = new Vector2d(this.parentSim.player.position.x, this.parentSim.player.position.y);
      }
    } else if (stepsToPlayer == 1) {
      // Attack if close enough to the player
      var direction = this.getDirection(this.parentSim.player.position);
      this.attack(this.parentSim.player.position, direction);
      return;
    }

    // Walk towards the last known player location
    if (this.playerSeenPosition && !this.playerSeenPosition.equals(this.position)) {
      this.walkTo(this.playerSeenPosition);
      return;
    }

    // Skip turn
    this.doNothing();
  }
}

AI.prototype.render = function () {
  Character.prototype.render.call(this);
  var screenPosition = this.getScreenPosition();
  /*if (this.playerSeenPosition) {
    var targetScreenPosition = v2dMultiply(this.playerSeenPosition, this.parentSim.mapFieldSize);
    targetScreenPosition.sub(this.parentSim.getCameraPosition());
    drawRectOutline(targetScreenPosition.x+8, targetScreenPosition.y+8, 16, 16, 1, '#FFFFFF');
    drawLine(screenPosition.x+16, screenPosition.y+16, targetScreenPosition.x+16, targetScreenPosition.y+16, 1, "#FFFFFF");
  }*/
  if (this.hitPoints > 0)
    drawProgressBar(screenPosition.x, screenPosition.y + 32, 32, 4, this.hitPoints / this.maxHitPoints, '#00FF00');
};

// Walk closer to the given parameters
AI.prototype.walkTo = function (position) {
  var dx = this.position.x - position.x;
  var dy = this.position.y - position.y;
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
