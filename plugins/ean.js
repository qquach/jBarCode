/**
* Copyright © Quoc Quach 2013-2014
* Author: Quoc Quach
* Email: quoc_cooc@yahoo.com
* Released under the MIT license
* Date: 10/29/2013
*/
(function($){
	if($.jBarCode == undefined){
		console.error("eanRender depended on jBarCode");
		return;
	}	
	var eanRender = {
		/**
		 * type of chart will be render when user call. Array of all types that the plugin able to handle.
		 */
		types: ["ean8","ean13","upc"],
		/**
		 * set default options for bar code
		 */
		options:{
			font: 11,
			paddingLeftRight: 15,
			lineWidth: 1,
			codePadding: -2,
			extBarHeight: 5
		},
		/**
		 * Validate data before rendering
		 */
		/**
		 * Initialize any data to help create canvas by setting width and height,
		 * if width and height was not know ahead of time.
		 */
		init: function(){			
			if(this.options.type == 'ean8'){
				this.options.codeWidth = (8*7+11)*this.options.lineWidth;
			}else{
				this.options.codeWidth = (13*7+11)*this.options.lineWidth;
			}							

		},
		/**
		 * Validate data before rendering. It call before object created
		 */
		validate: function(code,type){
			if(type=='ean8' && code.length!=8) return false;
			if(type=='ean13' && code.length!=13) return false;
			if(type=='upc'){
				if(code.length!=12) return false;	
				code = '0'+code;
			} 
			var checkDigit = EAN_check_digit(code.substring(0,code.length-1));
			var checkDigitValid = checkDigit == code[code.length-1];
			if(!checkDigitValid){
				console.error("Check digit invalid");
			}
			return checkDigitValid;
		},
		/**
		 * generate bar code, need to handler all type of bar codes declare in the 
		 */
		generate: function(){
			if(this.options.type=="ean13"){
				this.draw_EAN_13(this.options.code);
			}
			else if (this.options.type=="ean8") {
				this.draw_EAN_8(this.options.code);
			}
			else{
				this.draw_UPC_A(this.options.code);
			}
		},
		/**
		 * show code value for current barcode, set to null to use default render
		 */
		showCode:function(){
			var text, x, y, align;
			switch(this.options.type){
			case 'ean8':	
				text = this.options.code.substring(0,4);
				x = this.options.paddingLeftRight + (3 + 2*7) * this.options.lineWidth;
				align = 'center';
				this.drawText(text,x,y,align);
				
				text = this.options.code.substring(4);
				x = this.options.paddingLeftRight + (3 + 4*7 + 5 + 2*7) * this.options.lineWidth;
				this.drawText(text,x,y,align);
				break;
			case 'ean13':
				text = this.options.code.substring(0,1);
				x = this.options.paddingLeftRight - 2;
				align = 'right';
				this.drawText(text,x,y,align);
				
				text = this.options.code.substring(1,7);
				x = this.options.paddingLeftRight + (3 + 3*7) * this.options.lineWidth;
				align = 'center';
				this.drawText(text,x,y,align);
				
				text = this.options.code.substring(7);
				x = this.options.paddingLeftRight + (3 + 6*7 + 5 + 3*7) * this.options.lineWidth;
				this.drawText(text,x,y,align);
				
				break;
			case 'upc':
				text = this.options.code.substring(0,1);
				x = this.options.paddingLeftRight - 2;
				align = 'right';
				this.drawText(text,x,y,align);
				
				text = this.options.code.substring(1,6);
				x = this.options.paddingLeftRight + (3 + 3*7) * this.options.lineWidth;
				align = 'center';
				this.drawText(text,x,y,align);
				
				text = this.options.code.substring(6,11);
				x = this.options.paddingLeftRight + (3 + 6*7 + 5 + 3*7) * this.options.lineWidth;
				this.drawText(text,x,y,align);
				
				text = this.options.code.substring(11);
				x = this.options.paddingLeftRight + (3*2 + 12*7 + 5) * this.options.lineWidth + 2;
				align = 'left';
				this.drawText(text,x,y,align);
				break;
			}
		},
		/**
		 * share function among all chart object. Corresponse to the prototype of a function (class).
		 * to use the properties of the object.
		 */
		prototype: {
			draw_EAN_13: function(inputCode){	
				parityString = PARITY_CODES[parseInt(inputCode.charAt(0),10)];
				// draw the start code
				var nextPos = this.options.paddingLeftRight;
				this.options.barHeight += this.options.extBarHeight;
				nextPos = this.drawCode(START_CODE,nextPos);
				this.options.barHeight -= this.options.extBarHeight;
				// draw the first block		
				for (var i=1;i<7;i++){
					if(parityString.charAt(i-1)=='1'){
						codes = ODD_LEFT_CODES[parseInt(inputCode.charAt(i),10)];
					}				
					else{
						codes = EVEN_LEFT_CODES[parseInt(inputCode.charAt(i),10)];
					}
					nextPos = this.drawCode(codes,nextPos);
				}
				// draw the middle code
				this.options.barHeight += this.options.extBarHeight;
				nextPos = this.drawCode(MIDDLE_CODE,nextPos);
				this.options.barHeight -= this.options.extBarHeight;
				// draw the second block
				for (var i=7;i<13;i++){
					codes = RIGHT_CODES[parseInt(inputCode.charAt(i),10)];
					nextPos = this.drawCode(codes,nextPos);
				}		
				// draw the end code
				this.options.barHeight += this.options.extBarHeight;
				this.drawCode(END_CODE,nextPos);
				this.options.barHeight -= this.options.extBarHeight;
			},		
			draw_EAN_8: function(inputCode){	
				// draw the start code
				var nextPos = this.options.paddingLeftRight;
				this.options.barHeight += this.options.extBarHeight;
				nextPos = this.drawCode(START_CODE,nextPos);
				this.options.barHeight -= this.options.extBarHeight;
				// draw the first block			
				for (var i=0;i<4;i++){
					codes = ODD_LEFT_CODES[parseInt(inputCode.charAt(i),10)];
					nextPos = this.drawCode(codes,nextPos);
				}
				// draw the middle code
				this.options.barHeight += this.options.extBarHeight;
				nextPos = this.drawCode(MIDDLE_CODE,nextPos);
				this.options.barHeight -= this.options.extBarHeight;
				// draw the second block
				for (var i=4;i<8;i++){
					codes = RIGHT_CODES[parseInt(inputCode.charAt(i),10)];
					nextPos = this.drawCode(codes,nextPos);
				}		
				// draw the end code
				this.options.barHeight += this.options.extBarHeight;
				this.drawCode(END_CODE,nextPos);
				this.options.barHeight -= this.options.extBarHeight;
			},		
			draw_UPC_A: function(inputCode){
				this.draw_EAN_13('0'+inputCode);
			}
		}
	};
	$.jBarCode.register(eanRender);
	//=================================constant variables========================
	var ODD_LEFT_CODES =  ['0001101',//0 
						 '0011001',//1
						 '0010011',//2
						 '0111101',//3
						 '0100011',//4
						 '0110001',//5
						 '0101111',//6
						 '0111011',//7
						 '0110111',//8
						 '0001011'];//9
		var EVEN_LEFT_CODES = ['0100111',//0 
						 '0110011',//1
						 '0011011',//2
						 '0100001',//3
						 '0011101',//4
						 '0111001',//5
						 '0000101',//6
						 '0010001',//7
						 '0001001',//8
						 '0010111'];//9		
							 
		var RIGHT_CODES= ['1110010',//0 
					 '1100110',//1
					 '1101100',//2
					 '1000010',//3
					 '1011100',//4
					 '1001110',//5
					 '1010000',//6
					 '1000100',//7
					 '1001000',//8
					 '1110100'];//9			
					 
		var PARITY_CODES=['111111',//0 
					 '110100',//1
					 '110010',//2
					 '110001',//3
					 '101100',//4
					 '100110',//5
					 '100011',//6
					 '101010',//7
					 '101001',//8
					 '100101'];//9	 	
						 				 	 
		var START_CODE='101';
		var END_CODE = '101';
		var MIDDLE_CODE = '01010';
		var EAN_check_digit = function(inputCode){
			var ean8 = [3,1];
			var ean13 = [1,3];
			var checkDigit = 0;
			for (var i=0; i<inputCode.length; i++){
				var digit = parseInt(inputCode.charAt(i),10);
				var weight = inputCode.length=7 ? ean8[i%2] : ean13[i%2];
				checkDigit += digit*weight;
			}
			checkDigit = (checkDigit%10!=0) ? 10-checkDigit%10 : 0 ;
			return checkDigit;
		};
})(jQuery);