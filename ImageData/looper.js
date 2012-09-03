;(function(fsm, stage, context){
	var Looper = function(config){
		this.interval = config.interval || 16;
	};	
	
	Looper.prototype.start = function(){
		this.startLoopTime = (+new Date);
		var timePoint = this.startLoopTime;
		this.timer = setInterval((function(looper){
			var dt = (+new Date) - timePoint;
			timePoint += dt;
			return function(){
				looper.loop(dt);
			};
		})(this), this.interval);
	};
	
	Looper.prototype.stop = function(){
		clearInterval(this.timer);
	};
	
	Looper.prototype.loop = function(dt){
		this.update(dt);
		this.draw();
	};
	
	Looper.prototype.update = function(dt){
		fsm.update(dt);
	};
	
	Looper.prototype.draw = function(){
		stage.render();
	};
	
	context.$Looper = Looper;
})(this.$Fsm, this.$Stage, this);