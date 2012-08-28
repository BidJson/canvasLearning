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
		ctx.drawImage(this.img, 0, 0, iw, ih, (cw - iw) / 2, (ch - ih) / 2, iw, ih);
		_imgData = ctx.getImageData((cw - iw) / 2, (ch - ih) / 2, iw, ih),
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
					_r.push({
						x : j,
						y : i,
						posX : j * 8 + (this.canvasWidth - this.imgWidth * 8) / 2,
						posY : i * 8 + (this.canvasHeight - this.imgHeight * 8) / 2,
						l : j,
						r : _data[_index],
						g : _data[_index+1],
						b : _data[_index+2],
						a : _data[_index+3],
						rotateY : function(angle){
							var offset = Math.cos(angle);
						}
					});
				}
			}
			_pixels.push(_r);
		}
		ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		console.debug(_pixels);
		this.pixels = _pixels;
	}
	
	ptp.draw = function(){
		var ctx = this.ctx,
			_pixels = this.pixels;
		
		// 绘制像素
		for(var i = 0; i < _pixels.length; i++){
			for(var j = 0; j < _pixels[i].length; j++){
				var _p = _pixels[i][j];
				ctx.fillStyle = 'rgba(' + _p['r'] + ',' + _p['g'] +',' + _p['b'] + ',' + _p['a'] + ')';
				ctx.beginPath();
				ctx.arc(_p.posX, _p.posY, 2.5, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
	
	ptp.rotateY = function(angle){
		if(!this.isRotate) return;
		for(var i = 0; i < this.pixels.length; i++) this.pixels[i].rotateY(angle);
	}
	
	ptp.switchRotate = function(){
		this.isRotate = !this.isRotate;
	}
	
	ptp = null;
	
	this.ImgData = ImgData;
})();