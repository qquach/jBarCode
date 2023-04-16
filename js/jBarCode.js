/**
* Copyright � Quoc Quach 2013-2014
* Author: Quoc Quach
* Email: quoc_cooc@yahoo.com
* Released under the MIT license
* Date: 11/22/2013
*/
(function($){
	var defaultOptions = {
		codeWidth: 200,		
		lineWidth: 1,//width of the smallest line
		barHeight: 50,//height of each bar.	
		showCode: true,
		font: 12,//px
		codePadding: 5,
		paddingTopBottom: 10,
		paddingLeftRight: 10
	};
	/**
	 * hash with type point to render function.
	 */
	var barCodeRenders = {};
	$.fn.jBarCode = function(code,type,opts){
		if($(this).length==0){
			console.error('select element to place bar code into');
			return;
		}
		
		var t = type.toLowerCase();
		var plugin = barCodeRenders[t];
		
		if(!plugin){
			console.error('request type to render invalid');
			return;
		}			
		
		if(!plugin.validate(code,type)){
			console.error('The supply code is invalid for requested type: %s', type);
			return;
		}
		var extOptions = plugin.options;
		var options = $.extend({},defaultOptions,extOptions,opts,{code:code, type:type});		
		var render = new jBarCode($(this),options);
		render.generate();
		return render;
	};
	//jBarCode.types = barCodeRenders;
	$.jBarCode = {
		register: function(render){		
			for(var i = 0; i<render.types.length; i++){
				var type = render.types[i];
				barCodeRenders[type.toLowerCase()] = render;				
			}
			$.extend(jBarCode.prototype,render.prototype);
		}	
	}
	var jBarCode = function(jObj,options){
		this.jObj = jObj;
		this.options = options;
		this.init();
		var width = this.options.codeWidth  + 2*this.options.paddingLeftRight;
		var height = this.options.barHeight + 2* this.options.paddingTopBottom + (this.options.showCode ? this.options.font + this.options.codePadding : 0 );
		var canvas = $(format('<canvas style="border: black 1px solid;" width="%d" height="%d"/>', width, height));
		this.jObj.append(canvas);
		var el = canvas.get(0);
		this.canvas = el;
		//special initialize for canvas context with excanvas library
		if(typeof(HTMLCanvasElement) != "undefined") {
			this.context = el.getContext("2d");
		}else {					
			G_vmlCanvasManager.initElement(el);
			this.context = el.getContext('2d');	
		}
	};	
	
	jBarCode.prototype = {
		init:function(){
			var plugin = barCodeRenders[this.options.type.toLowerCase()];
			plugin.init.apply(this);
		},
		generate:function(){
			var plugin = barCodeRenders[this.options.type.toLowerCase()];
			plugin.generate.apply(this);
			if(this.options.showCode){
				if(plugin.showCode){
					plugin.showCode.apply(this);
				}
				else{
					this.drawText(this.options.code);
				}
			}
		},
		/**
		 * code is a string of the binary 0 and 1 represent for space for line
		 */
		drawCode: function(codeStr,start){			
			for(var i = 0; i< codeStr.length; i++,start+=this.options.lineWidth){
				var code = codeStr.charAt(i);
				if(code=='0') continue;
				this.drawLine(start);
			}
			return start;
		},
		/**
		 * draw vertical line for each bar with provide where to start and the width of the line.
		 */
		drawLine: function(start,width){
			var top = this.options.paddingTopBottom,
				bottom = top + this.options.barHeight,
				width = width || this.options.lineWidth;
			this.context.save();
			this.context.beginPath();
			this.context.strokeStyle = "black";
			this.context.lineWidth=width;		
			this.context.moveTo(start+0.5,top);
			this.context.lineTo(start+0.5,bottom);
			this.context.stroke();
			this.context.restore();
		},
		drawText: function(text,x,y,textAlign){
			x = x || this.canvas.width/2;			
			y = y || (this.options.paddingLeftRight + this.options.barHeight + this.options.codePadding);
			textAlign = textAlign || 'center';
			textAlign = textAlign || "start";
			this.context.save();
			this.context.fillStyle = "black";
			this.context.font = format("%dpx Arial",this.options.font);
			this.context.textAlign = textAlign;
			this.context.textBaseline = "top";
			this.context.fillText(text,x,y)
			this.context.restore();
		}
	}			
	/**
	 * helper function to format string
	 */
	function format() {
		var format = arguments[0] || "";
		var match = format.match(/%s|%d|%j/g);
		if (!match) return format;

		if (match.length != arguments.length - 1) throw { name: "Argument Error", message: "Number of arguments mismatch" };
		for (var i = 1; i < arguments.length; i++) {
			var matchIndex = i - 1;
			var value = (match[matchIndex] == "%j") ? JSON.stringify(arguments[i]) : arguments[i];
			format = format.replace(match[matchIndex], value);
		}
		return format;
	}	
	
})(jQuery);
