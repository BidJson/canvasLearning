;(function(context){
	var Fsm = function(statesList){
		this.stateArray = {};
		for(var i in statesList){
			if(statesList.hasOwnProperty(i)){
				if(!statesList[i] instanceof State) statesList[i] = new State(this, i);
				this.stateArray[i] = statesList[i];
			}
		}	
		this.currentState = Fsm.NoState;
		this.duration = 0;	
	};
	
	Fsm.NoState = -1;
	Fsm.NextState = 1;
	
	var setState = function(host, state){
		if(!state) state = Fsm.NextState;
		if(!host.currentState === Fsm.NoState) host.stateArray[host.currentArray].leave();
		host.currentState = (state === Fsm.NextState) ? (host.currentState + Fsm.NextState) : state;
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
	
	var State = function(stateId){
		this.stateId = stateId;
		this.enter = function(){};
		this.leave = function(){};
		this.update = function(){};
		this.transition = function(){};
	};
	
	if(!context.Fsm) context.$Fsm = Fsm;
	if(!context.$State) context.$State = State;
	
})(this);