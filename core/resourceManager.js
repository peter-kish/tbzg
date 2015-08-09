var lastRM = null;

// PendingAnimationResource class constructor
var PendingAnimationResource = function(image, key, frameW, frameH, frameDelay) {
  this.image = image;
  this.key = key;
  this.frameW = frameW;
  this.frameH = frameH;
  this.frameDelay = frameDelay;
}

// ResourceManager class constructor
var ResourceManager = function() {
  this.resources = {};
  this.nResources = 0;
  this.nLoadedResources = 0;
  this.pendingAnimations = [];

  lastRM = this;
}

// Callback for loaded resources
function onLoadCallback() {
  lastRM.nLoadedResources++;
  console.log("Loaded image " + this.src);

  // Check if there is an animation resource waiting for this image
  for (var i = 0; i < lastRM.pendingAnimations.length; i++) {
    var pendingAnim = lastRM.pendingAnimations[i];
    if (pendingAnim.image && pendingAnim.image == this) {
      lastRM.resources[pendingAnim.key] = new Animation(this, pendingAnim.frameDelay, pendingAnim.frameW, pendingAnim.frameH);
      lastRM.nLoadedResources++;
      console.log("Loaded animation " + this.src);
      lastRM.pendingAnimations.splice(i, 1);
      return;
    }
  }
}

// Load an image from the given path and with the given key
ResourceManager.prototype.loadImage = function (path, key) {
  this.nResources++;
  var image = loadImage(path, onLoadCallback);
  this.resources[key] = image;
  return image;
};

// Load an animation from the given path and with the given key, frame dimnsions and delay
ResourceManager.prototype.loadAnimation = function (imagePath, key, frameW, frameH, frameDelay) {
  var image = this.loadImage(imagePath, imagePath);
  this.nResources++;
  this.pendingAnimations.push(new PendingAnimationResource(image, key, frameW, frameH, frameDelay));
  return image;
};

// Returns the resource with the given key
ResourceManager.prototype.getResource = function (key) {
  return this.resources[key];
};

// Checks if all resources are loaded
ResourceManager.prototype.loaded = function () {
  if (this.nResources == this.nLoadedResources)
    return true;

  return false;
};
