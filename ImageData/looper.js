;(function(context){
	var Looper = {};
	Looper.interval = 16;
	
	Looper.init = function(fsm, stage){
		this.fsm = fsm;
		this.stage = stage;
	};
	
	Looper.start = function(){
		this.startLoopTime = (+new Date);
		var timePoint = this.startLoopTime;
		this.timer = setInterval((function(looper){
			return function(){
				var dt = (+new Date) - timePoint;
				looper.loop(dt);
				timePoint += dt;
			};
		})(this), this.interval);
	};
	
	Looper.stop = function(){
		clearInterval(this.timer);
	};
	
	Looper.loop = function(dt){
		this.update(dt);
		this.draw();
	};
	
	Looper.update = function(dt){
		this.fsm.update(dt);
	};
	
	Looper.draw = function(){
		this.stage.render();
	};
	
	context.Looper = Looper;
})(this);