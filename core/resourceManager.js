var lastRM = null;

// ResourceManager class constructor
var ResourceManager = function() {
  this.resources = {};
  this.nResources = 0;
  this.nLoadedResources = 0;
  lastRM = this;
}

// Callback for loaded resources
function onLoadCallback() {
  lastRM.nLoadedResources++;
}

// Load an image from the given path and with the given key
ResourceManager.prototype.loadImage = function (path, key) {
  this.nResources++;
  var image = loadImage(path, onLoadCallback);
  this.resources[key] = image;
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
