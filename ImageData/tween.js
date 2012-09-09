;(function(context){
	var Tween = function(operator, to, duration, trace, force_to){
		this.operator = operator;
		this.to = to;
		this.duration = duration;
		this.trace = trace;
		this.end = true;
		this.force_to = !!force_to;
	};
	
	Tween.prototype = new context.$State(0);
	
	Tween.prototype.enter = function(){
		this.from = {};
		for(var i in this.to){
			if(this.to.hasOwnProperty(i) && this.operator.hasOwnProperty(i)) {
				this.from[i] = this.operator[i];
			}
		}
		this.startTime = this.timePoint = (+new Date);
		this.end = false;		
	};
	
	Tween.prototype.leave = function(){
	};
	
	Tween.prototype.transition = function(){
		if(this.timePoint - this.startTime >= this.duration){
			this.end = true;
			if(this.force_to){
				for(var k in this.to){
					if(this.to.hasOwnProperty(k) && this.operator.hasOwnProperty(k)) this.operator[k] = this.to[k];
				}
			}
			this.host.next();
		}
	};
	
	Tween.prototype.update = function(dt){
		if(this.end) return;
		var dt = (+new Date) - this.timePoint;
		
		if(this.to){
			// TODO 根据轨迹函数应用到各属性变换
			this.operator.xpos += (this.to.xpos - this.from.xpos) * Math.sin(Math.PI*dt/(3*this.duration));
			this.operator.ypos += (this.to.ypos - this.from.ypos) * Math.sin(Math.PI*dt/(3*this.duration));
			this.operator.zpos += (this.to.zpos - this.from.zpos) * Math.sin(Math.PI*dt/(3*this.duration));
/* 			this.operator.xpos += (this.to.xpos - this.from.xpos) * dt/this.duration;
			this.operator.ypos += (this.to.ypos - this.from.ypos) * dt/this.duration;
			this.operator.zpos += (this.to.zpos - this.from.zpos) * dt/this.duration; */
			// 暂时写死，以后实现扩展
		}
		
		this.timePoint = (+new Date);
	};
	
	Tween.stillTween = function(operator, duration){
		return new context.Tween(operator, null, duration);
	};
	
	var TweenAnim = function(states){
		var instance = new context.$Fsm(states);
		return instance;
	};
	
	if(!context.Tween) context.Tween = Tween;
	if(!context.TweenAnim) context.TweenAnim = TweenAnim;
})(this);
