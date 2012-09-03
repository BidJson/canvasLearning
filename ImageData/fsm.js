;(function(context){
	
	var Fsm = function(stateList){
		this.stateArray = {};
		for(var i in stateList){
			if(stateList.hasOwnProperty(i)){
				if(!stateList[i] instanceof State) stateList[i] = new State(this, i);
				this.stateArray[i] = stateList[i];
			}
		}
		this.currentState = Fsm.NoState;
		this.duration = 0;
	};
	
	var setState = function(host, state){
		if(!state) state = Fsm.NextState;
		if(!host.currentState === Fsm.NoState) host.stateArray[host.currentArray].leave();
		host.currentState = (state === Fsm.NextState) ? (host.currentState + Fsm.NextState) : state;
	};
	
	Fsm.prototype.init = function(startState){
		this.enter(startState);
	};
	
	Fsm.prototype.leave = function(){
		setState(this, Fsm.NoState);
	};
	
	Fsm.prototype.enter = function(state){
		setState(this, state);
		this.stateArray[this.currentState].enter();
	};
	
	Fsm.prototype.update = function(dt){
		if(this.currentState === Fsm.NoState) return;
		this.stateArray[this.currentState].update(dt);
		this.stateArray[this.currentState].transition();
	};
	
	Fsm.NoState = -1;
	Fsm.NextState = 1;
	
	context.$Fsm = Fsm;
	
	var State = function(host, stateId){
		this.stateId = stateId;
		this.host = host;
		this.enter = function(){};
		this.leave = function(){};
		this.update = function(){};
		this.transition = function(){};
	};
	
	context.$State = State;
	
})(this);