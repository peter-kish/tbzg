var lastRM = null;

// AnimationResource class constructor
var AnimationResource = function(image, frameW, frameH, frameDelay) {
  this.image = image;
  this.frameW = frameW;
  this.frameH = frameH;
  this.frameDelay = frameDelay;
}

// ResourceManager class constructor
var ResourceManager = function() {
  this.resources = {};
  this.nResources = 0;
  this.nLoadedResources = 0;

  lastRM = this;
}

// Callback for loaded image resources
function onImageLoadCallback() {
  lastRM.nLoadedResources++;
  console.log("Loaded image " + this.src);
}

// Callback for loaded animation resources
function onAnimationLoadCallback() {
  lastRM.nLoadedResources++;
  console.log("Loaded animation " + this.src);
}

// Load an image from the given path and with the given key
ResourceManager.prototype.loadImage = function (path, key) {
  this.nResources++;
  var image = loadImage(path, onImageLoadCallback);
  this.resources[key] = image;
  return image;
};

// Load an animation from the given path and with the given key, frame dimnsions and delay
ResourceManager.prototype.loadAnimation = function (imagePath, key, frameW, frameH, frameDelay) {
  var image = loadImage(imagePath, onAnimationLoadCallback);
  this.nResources++;
  this.resources[key] = new AnimationResource(image, frameW, frameH, frameDelay);
  return image;
};

// Returns the resource with the given key
ResourceManager.prototype.getResource = function (key) {
  return this.resources[key];
};

// Returns an instance of the animation with the given key
ResourceManager.prototype.getAnimationInstance = function (key) {
  var animRes = this.getResource(key);
  if (animRes)
    return new Animation(animRes.image, animRes.frameDelay, animRes.frameW, animRes.frameH);

  return null;
};

// Checks if all resources are loaded
ResourceManager.prototype.loaded = function () {
  if (this.nResources == this.nLoadedResources)
    return true;

  return false;
};
