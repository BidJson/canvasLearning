;(function(context){	
	var State = function(stateId, host){
		this.stateId = stateId;
		this.host = host;
		this.enter = function(){};
		this.leave = function(){};
		this.update = function(){};
		this.transition = function(){};
	};
	
	State.prototype.setHost = function(host){
		this.host = host;
	};
	
	State.prototype.setStateId = function(stateId){
		this.stateId = stateId;
	};
	
	var Fsm = function(statesList){
		this.stateArray = [];
		this.stateMap = {};
		for(var i = 0; i < statesList.length; i++){
			if(!statesList[i] instanceof State) statesList[i] = new State(i, this);
			if(!statesList[i].host) statesList[i].setHost(this);
			this.stateArray.push(statesList[i]);
			this.stateMap[statesList[i].stateId || i] = i;
		}
		this.currentState = Fsm.NoState;
		this.duration = 0;	
	};
	
	Fsm.NoState = -1;
	Fsm.NextState = 1;
	
	// 状态转换：离开当前状态，进入目标状态
	var setState = function(host, state){
		if(host.currentState !== Fsm.NoState) host.stateArray[host.currentState].leave();
		host.currentState = state;
		if(host.currentState !== Fsm.NoState) host.stateArray[host.currentState].enter();
	};
	
	Fsm.prototype.leave = function(){
		setState(this, Fsm.NoState);
	};
	
	Fsm.prototype.enter = function(state){
		if(state > this.stateArray.length - 1) state = Fsm.NoState;
		setState(this, state);
	};

	// 按顺序转换到下一个状态	
	Fsm.prototype.next = function(){
		var state = this.currentState + Fsm.NextState;
		this.enter(state);
	};
	
	Fsm.prototype.update = function(dt){
		if(this.currentState === Fsm.NoState) return;
		this.stateArray[this.currentState].update(dt);
		this.stateArray[this.currentState].transition();
	};
	
	if(!context.Fsm) context.$Fsm = Fsm;
	if(!context.$State) context.$State = State;
	
})(this);