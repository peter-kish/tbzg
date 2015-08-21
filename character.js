// Character directions
var CHR_DIR_LEFT = 0;
var CHR_DIR_RIGHT = 1;
var CHR_DIR_UP = 2;
var CHR_DIR_DOWN = 3;
var CHR_DIR_INVALID = 4;

// Character states
var CHR_ST_IDLE = 0;
var CHR_ST_MOVE = 1;
var CHR_ST_ATTACK = 2;
var CHR_ST_RELOAD = 3;
var CHR_ST_TURN_END = 4;

// State transition speeds (in ms)
var CHR_WALK_SPEED = 300;
var CHR_ATTACK_SPEED = 300;
var CHR_RELOAD_SPEED = 300;

// Character class constructor
var Character = function(parentSim, position) {
  this.position = new Vector2d(position.x, position.y);
  this.prevPosition = new Vector2d(position.x, position.y);
  this.parentSim = parentSim;
  this.stateMachine = new FuzzyStateMachine(CHR_ST_IDLE);
  this.facing = CHR_DIR_RIGHT;
  this.maxHitPoints = 15;
  this.hitPoints = this.maxHitPoints;
  this.animationSet = null;
  this.torsoSprite = new Sprite();
  this.legsSprite = new Sprite();
  this.inventory = new Inventory(10);
  this.meleeSlot = null;
  this.rangedSlot = null;
}

// Play a torso sprite animation
Character.prototype.playAnimation = function (animationKey) {
  this.torsoSprite.playAnimation(this.parentSim.resourceManager.getAnimationInstance(animationKey));
};

// Stops the torso sprite animation
Character.prototype.stopAnimation = function () {
  this.torsoSprite.stopAnimation();
};

// Sets the torso sprite image
Character.prototype.setImage = function (imageKey) {
  this.torsoSprite.setImage(this.parentSim.resourceManager.getResource(imageKey));
};

// Play a legs sprite animation
Character.prototype.playLegsAnimation = function (animationKey) {
  this.legsSprite.playAnimation(this.parentSim.resourceManager.getAnimationInstance(animationKey));
};

// Stops the legs sprite animation
Character.prototype.stopLegsAnimation = function () {
  this.legsSprite.stopAnimation();
};

// Sets the legs sprite image
Character.prototype.setLegsImage = function (imageKey) {
  this.legsSprite.setImage(this.parentSim.resourceManager.getResource(imageKey));
};

// Render the character
Character.prototype.render = function () {
  var screenPosition = this.getScreenPosition();
  screenPosition.add(new Vector2d(this.parentSim.mapFieldSize / 2, this.parentSim.mapFieldSize / 2));
  this.torsoSprite.render(screenPosition, true, this.facing == CHR_DIR_LEFT, false);
  this.legsSprite.render(screenPosition, true, this.facing == CHR_DIR_LEFT, false);
};

// Update the character
Character.prototype.update = function () {
  if (this.isInSolidState(CHR_ST_MOVE) ||
      this.isInSolidState(CHR_ST_ATTACK) ||
      this.isInSolidState(CHR_ST_RELOAD)) {
    this.stateMachine.setState(CHR_ST_TURN_END, 0);
  }
  this.torsoSprite.update();
  this.legsSprite.update();
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
Character.prototype.walk = function (direction) {
  if (this.isInSolidState(CHR_ST_IDLE)) {
    this.faceTo(direction);
    this.playLegsAnimation(this.animationSet.legs_walk);
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

// Equips the given melee weapon
Character.prototype.equipMelee = function (weapon) {
  this.meleeSlot = weapon;
};

// Equips the given ranged weapon
Character.prototype.equipRanged = function (weapon) {
  this.rangedSlot = weapon;
};

// Perform a melee Attack in the given direction
Character.prototype.meleeAttack = function (position, direction) {
  if (!this.meleeSlot)
    return false;

  var damage = this.meleeSlot.damage;
  if (this.isInSolidState(CHR_ST_IDLE) && damage) {
    var character = this.parentSim.getCharacterAt(position);
    if (!character)
      return false;

    if (position.x < this.position.x) {
      this.faceTo(CHR_DIR_LEFT);
    } else {
      this.faceTo(CHR_DIR_RIGHT);
    }
    character.takeDamage(damage, direction);
    this.stateMachine.setState(CHR_ST_ATTACK, CHR_ATTACK_SPEED);
    this.playAnimation(this.animationSet.attack_melee);
    this.setImage(this.animationSet.idle_melee);
    return true;
  }
  return false;
};

// Perform a ranged Attack in the given direction
Character.prototype.rangedAttack = function (position, direction) {
  if (!this.rangedSlot) {
    return false;
  }

  if (this.rangedSlot.isStackable() && this.rangedSlot.getAmmo() < 0) {
    return false;
  }

  var damage = this.rangedSlot.damage;
  if (this.isInSolidState(CHR_ST_IDLE) && damage) {
    var character = this.parentSim.getCharacterAt(position);
    if (!character)
      return false;

    if (!this.rangedSlot.consume(1)) {
      return false;
    }

    if (position.x < this.position.x) {
      this.faceTo(CHR_DIR_LEFT);
    } else {
      this.faceTo(CHR_DIR_RIGHT);
    }
    character.takeDamage(damage, direction);
    this.stateMachine.setState(CHR_ST_ATTACK, CHR_ATTACK_SPEED);
    this.playAnimation(this.animationSet.attack_ranged);
    this.setImage(this.animationSet.idle_ranged);
    return true;
  }
  return false;
};

// Reloads the ranged weapon
Character.prototype.reload = function (item) {
  if (!item) {
    item = this.rangedSlot;
  }

  if (item) {
    var ammoAvailable = 0;
    var ammoItem = this.inventory.find(item.ammoName);
    if (ammoItem) {
      ammoAvailable = ammoItem.count;
      if (ammoAvailable == 0) {
        return false;
      }
    } else {
      return false;
    }

    if (item.getAmmo() < item.maxCount) {
      if (item.slowReload) {
        if (ammoAvailable >= 1) {
          item.reload(1);
          ammoItem.consume(1);
        }
      } else {
        if (ammoAvailable >= item.maxCount - item.count) {
          item.reload();
          ammoItem.consume(item.maxCount - item.count);
        } else {
          item.reload(ammoAvailable);
          ammoItem.consume(ammoAvailable);
        }
      }
      this.stateMachine.setState(CHR_ST_RELOAD, CHR_RELOAD_SPEED);
      return true;
    }
  }
  return false;
};

// Apply the given damage on the character
Character.prototype.takeDamage = function (damage, direction) {
  if (this.isAlive()) {
    this.hitPoints = Math.max(this.hitPoints - damage.hitPoints, 0);
    if (!this.isAlive()) {
      this.setImage(this.animationSet.dead);
      this.playAnimation(this.animationSet.die);
      this.setLegsImage(null);
    }
  }
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
    this.meleeAttack(attackPosition, direction);
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
  var delta = v2dSub(position, this.position);
  if (delta.x > Math.abs(delta.y)) {
    return CHR_DIR_RIGHT;
  } else if (delta.x < -Math.abs(delta.y)) {
    return CHR_DIR_LEFT;
  } else if (delta.y > Math.abs(delta.x)) {
    return CHR_DIR_DOWN;
  } else if (delta.y < -Math.abs(delta.x)) {
    return CHR_DIR_UP;
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
inherit(AI, Character);

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
      this.meleeAttack(this.parentSim.player.position, direction);
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
  return this.position.chebyshevDistance(this.parentSim.player.position);
}
