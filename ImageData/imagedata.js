;(function(){
	
	var ImgData = function(canvas, img){
		this.canvas = canvas;
		this.canvasWidth = canvas.width = window.innerWidth;
		this.canvasHeight = canvas.height = window.innerHeight;
		this.ctx = canvas.getContext('2d');
		this.img = img;
		this.imgWidth = 0;
		this.imgHeight = 0;
		this.isRotate = false;
		this.angleSpeed = 1;
		this.range = function(value, a, b){
			return value;
			var max = Math.max(a, b), min = Math.min(a, b);
			if(value < min || value > max){
				return Math.random() * (max - min) + min;
			}else{
				return value;
			}
		}
		this.init();
	}
	
	var ptp = ImgData.prototype;
	ptp.init = function(){
		var iw = this.img.width,
			ih = this.img.height,
			cw = this.canvasWidth,
			ch = this.canvasHeight;
			ctx = this.ctx;
			_imgData = null,
			_data = null,
			_pixels = [],
			
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		ctx.drawImage(this.img, 0, 0, iw, ih, cw / 2 - iw / 4, ch / 2 - ih / 4, iw / 2, ih / 2);
		_imgData = ctx.getImageData(cw / 2 - iw / 4, ch / 2 - ih / 4, iw / 2, ih / 2),
		_data = _imgData.data;
		
		console.debug('width : ' + _imgData.width + ' height : ' + _imgData.height);
		this.imgWidth = _imgData.width;
		this.imgHeight = _imgData.height;
		
		// 生成像素
		for(var i = 0; i < _imgData.height; i++){
			var _r = [];
			for(var j = 0; j < _imgData.width; j++){
				var _index = 4 * (i * _imgData.width + j);
				if(_data[_index+3] > 128){  //半透明以上的像素点
					var x = (j - _imgData.width / 2),
						y = (i - _imgData.height / 2),
						_color = {
							r : this.range(_data[_index], 210, 256),
							g : this.range(_data[_index+1], 210, 256),
							b : this.range(_data[_index+2], 210, 256)
						},
					    _p = ImgData.createParticle(cw / 2, ch / 2, 0, x, y, 0, 2.5, ctx, _color, _data[_index+3]);
					    
					_r.push(_p);
				}
			}
			_pixels.push(_r);
		}
		_pixels[0][18]._log = true;
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		this.pixels = _pixels;
	}
	
	ptp.draw = function(){
		var ctx = this.ctx,
			_pixels = this.pixels;
		
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		// 绘制像素
		for(var i = 0; i < _pixels.length; i++){
			for(var j = 0; j < _pixels[i].length; j++){
				_pixels[i][j].render();
			}
		}
	}
	
	ptp.rotateY = function(angle){
		for(var i = 0; i < this.pixels.length; i++){
			for(var j = 0; j < this.pixels[i].length; j++){
				this.pixels[i][j].rotateY(angle);
			}
		}
	}
	
	ptp.switchRotate = function(){
		this.isRotate = !this.isRotate;
	}
	
	ptp.setCenterPoint = function(x, y ,z){
		
	};
	
	ptp.setVanishPoint = function(x, y, z){
		
	};
	
	ptp.step = function(){
		this.rotateY(Math.PI/180 * this.angleSpeed);
		this.draw();
	}
	
	ptp = null;
	
	ImgData.createParticle = function(cx, cy, cz, x, y, z, size, ctx, color, alpha){
		var p = CVS.createPoint3D(ctx, function(){
			this.setCenterPoint(cx, cy, cz);
			this.setVanishPoint(cx, cy);
			this.xpos = x;
			this.ypos = y;
			this.zpos = z;
			this.size = size;
			this.color = new CVS.$color(color.r, color.g, color.b);
			this.alpha = alpha;
			this.draw = function(){
				var _scale = ImgData.valueBetween(this.getScale(), 0.5, 2);
				_scale = this.getScale();
				if(this._log) console.log(this.alpha * _scale);
				ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g +',' + this.color.b + ',' + this.alpha * _scale + ')';
				ctx.beginPath();
				ctx.arc(cx+this.xpos*6*_scale, cy+this.ypos*6*_scale, this.size * _scale, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
			}
		});
		return p;
	};
	
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
	
	this.ImgData = ImgData;
})();