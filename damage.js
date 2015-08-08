// Constants
var DMG_MELEE = 0;
var DMG_BULLET = 1;

// Damage class constructor
var Damage = function(type, hitPoints, knockback) {
  this.hitPoints = hitPoints;
  this.type = type;
  if (knockback)
    this.knockback = knockback;
}
