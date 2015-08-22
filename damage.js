// Constants
var DMG_MELEE = 0;
var DMG_BULLET = 1;

// Damage class constructor
var Damage = function(type, hitPoints, knockback) {
  this.type = type;
  this.hitPoints = hitPoints;
  if (knockback) {
    this.knockback = knockback;
  } else {
    this.knockback = false;
  }
}

// Clones the Damage class
Damage.prototype.clone = function () {
  var newDamage = new Damage(this.type, this.hitPoints, this.knockback);
  return newDamage;
};
