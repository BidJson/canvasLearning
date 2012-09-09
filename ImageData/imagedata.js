;(function(context){
	
	var ImgData = function(canvas, img){
		this.canvas = canvas;
		this.canvasWidth = canvas.width = window.innerWidth;
		this.canvasHeight = canvas.height = window.innerHeight;
		this.ctx = canvas.getContext('2d');
		this.img = img;
		this.imgWidth = 0;
		this.imgHeight = 0;
		this.isRotate = false;
		this.angleSpeed_x = this.angleSpeed_y = 1;
		this.step_z = 1;
		this.speed_dir = 1;
		this.range = function(value, a, b){
			var max = Math.max(a, b), min = Math.min(a, b);
			if(value < min || value > max){
				return Math.random() * (max - min) + min;
			}else{
				return value;
			}
		}
		this.init();
	};
	
	var ptp = ImgData.prototype;
	ptp.init = function(){
		var iw = this.img.width,
			ih = this.img.height,
			cw = this.canvasWidth,
			ch = this.canvasHeight;
			ctx = this.ctx;
			_imgData = null,
			_data = null,
			_pixels = [];
			
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		ctx.drawImage(this.img, 0, 0, iw, ih, cw / 2 - iw / 4, ch / 2 - ih / 4, iw / 2, ih / 2);
		_imgData = ctx.getImageData(cw / 2 - iw / 4, ch / 2 - ih / 4, iw / 2, ih / 2),
		_data = _imgData.data;
		
		console.debug('width : ' + _imgData.width + ' height : ' + _imgData.height);
		this.imgWidth = _imgData.width;
		this.imgHeight = _imgData.height;
		
		// 生成像素
		for(var i = 0; i < _imgData.height; i++){
			for(var j = 0; j < _imgData.width; j++){
				var _index = 4 * (i * _imgData.width + j);
				if(_data[_index+3] > 128){  //半透明以上的像素点
					var x = (j - _imgData.width / 2) * 6,
						y = (i - _imgData.height / 2) * 6,
						_color = {
							r : _data[_index],
							g : _data[_index+1],
							b : _data[_index+2]
						},
					    _p = ImgData.createParticle(cw / 2, ch / 2, 0, x, y, 0, 2.5, ctx, _color, _data[_index+3], this);
					    
					_pixels.push(_p);
				}
			}
		}
		_pixels[0]._log = true;
		this.pixels = _pixels;
	};
	
	ptp.update = function(){
		for(var i = 0; i < this.pixels.length; i++){
			var _p = this.pixels[i];
			var _pos = _p.getScreenXY();
			if(this.isRotate){
				_p.rotateY(Math.PI/180 * this.angleSpeed_y);
				_p.rotateX(Math.PI/180 * this.angleSpeed_x);
			}
			_p.zpos += this.step_z * 0.5;
			_p.size = 2.5 * Math.max(_p.getScale(), 0);
			_p.x = _pos.x;
			_p.y = _pos.y;
			if(_p.tweenAnim) _p.tweenAnim.update();
		}
	};
	
	ptp.render = function(){
		var	_pixels = this.pixels;
		for(var i = 0; i < _pixels.length; i++) _pixels[i].render();
	};
	
	ptp.rotateY = function(angle){
		for(var i = 0; i < this.pixels.length; i++){
			this.pixels[i].rotateY(angle);
		}
	};

	ptp.rotateX = function(angle){
		for(var i = 0; i < this.pixels.length; i++){
			this.pixels[i].rotateX(angle);
		}
	};
	
	ptp.switchRotate = function(){
		this.isRotate = !this.isRotate;
	};
	
	ptp.step = function(){
		this.rotateY(Math.PI/180 * this.angleSpeed_y);
		this.rotateX(Math.PI/180 * this.angleSpeed_x);55
		this.render();
	};
	
	ptp.createTweenAnim = function(){
		for(var i = 0; i < this.pixels.length; i++){
			var _p = this.pixels[i], to = {xpos : _p.xpos, ypos : _p.ypos, zpos : _p.zpos};
			_p.xpos = ImgData.range(-this.canvasWidth/2, this.canvasWidth/2);
			_p.ypos = ImgData.range(-this.canvasHeight/2, this.canvasHeight/2);
			_p.zpos = ImgData.range(-this.canvasHeight/2, this.canvasHeight/2); 
			var gatherTween = new context.Tween(_p, to, 1000, null, true);
			to = {xpos : ImgData.range(-this.canvasWidth/2, this.canvasWidth/2), ypos : ImgData.range(-this.canvasHeight/2, this.canvasHeight/2), zpos : ImgData.range(-10, 10)};
			var explosionTween = new context.Tween(_p, to, 1000);
			_p.tweenAnim = new context.TweenAnim([context.Tween.stillTween(_p, 1000), gatherTween, context.Tween.stillTween(_p, 3000), explosionTween]);
			_p.tweenAnim.enter(0);
		}
	};
	
	ptp = null;
	
	ImgData.createParticle = function(cx, cy, cz, x, y, z, size, ctx, color, alpha, parent){
		var p = CVS.createPoint3D(ctx, function(){
			this.setCenterPoint(0, 0, 0);
			this.setVanishPoint(cx, cy);
			this.xpos = x;
			this.ypos = y;
			this.zpos = z;
			this.x = this.getScreenXY().x;
			this.y = this.getScreenXY().y;
			this.size = size;
			this.color = new CVS.$color(color.r, color.g, color.b);
			this.alpha = alpha;
			this.draw = function(){
				ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g +',' + this.color.b + ',' + /*this.alpha * ImgData.valueBetween(_scale, 1, 0.3) /*/ 256 + ')';
				ctx.beginPath();
				ctx.arc(this.x, this.y, Math.max(this.size, 0), 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
			}
		});
		return p;
	};

	ImgData.range = function(a, b){
		var max = Math.max(a, b), min = Math.min(a, b);
		return Math.random() * (max - min) + min;
	}
	
	ImgData.valueBetween = function(value, a, b){
		var max = Math.max(a, b), min = Math.min(a, b);
		if(value > max) return max;
		if(value < min) return min;
		return value;
	};
	
	ImgData.switchDebug = function(){
		ImgData.debug = !ImgData.debug;
	};
	
	ImgData.debug = false;
	
	if(!context.ImgData) context.ImgData = ImgData;
})(this);