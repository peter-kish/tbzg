var StateMachine = function(startState) {
  this.state = startState;
}

StateMachine.prototype.setState = function(state) {
  this.state = state;
}

StateMachine.prototype.getState = function() {
  return this.state;
}


var FuzzyStateMachine = function(startState) {
  this.state = startState;
  this.prevState = startState;
  this.fader = new Fader();
}

FuzzyStateMachine.prototype = new StateMachine();
FuzzyStateMachine.constructor = FuzzyStateMachine;

FuzzyStateMachine.prototype.setState = function(state, time) {
  if (time == 0) {
    this.prevState = this.state;
    this.state = state;
    this.fader.stop();
  } else {
    this.prevState = this.state;
    this.state = state;
    this.fader.start(time);
  }
}

FuzzyStateMachine.prototype.getProgress = function() {
  if (!this.isInTransition()) {
    return 1.0;
  } else {
    return this.fader.getProgress();
  }
}

FuzzyStateMachine.prototype.getPrevState = function() {
  return this.prevState;
}

FuzzyStateMachine.prototype.isInTransition = function() {
  if (!this.fader.isRunning())
    return false;
  return this.fader.getProgress() < 1.0;
  //return this.fader.isRunning();
}
