/**
* Copyright � Quoc Quach 2013-2014
* Author: Quoc Quach
* Email: quoc_cooc@yahoo.com
* Released under the MIT license
* Date: 10/29/2013
*/
(function($){
	if($.jBarCode == undefined){
		console.error("jIRender depended on jBarCode");
		return;
	}	
	var code39Render = {
		/**
		 * type of chart will be render when user call. Array of all types that the plugin able to handle.
		 */
		types: ["code39"],
		/**
		 * set default options for bar code
		 */
		options:{},
		/**
		 * Validate data before rendering
		 */
		/**
		 * Initialize any data to help create canvas by setting width and height,
		 * if width and height was not know ahead of time.
		 */
		init: function(){
			this.options.codeWidth = (this.options.code.length+2)*15+this.options.code.length;
		},
		/**
		 * Validate data before rendering. It call before object created
		 */
		validate: function(code){
			return !code.match(/[^0-9A-Z-\. \*$\/\+%]/);
		},
		/**
		 * generate bar code, need to handler all type of bar codes declare in the 
		 */
		generate: function(){			
			var nextPos = this.options.paddingLeftRight;
			nextPos = this.drawCode(code39Hash['*']+'0',nextPos);
			// Main Codes
			var codes = this.options.code;
			for (var i=0;i< codes.length;i++){
				var c = codes.charAt(i);
				nextPos = this.drawCode(code39Hash[c]+'0',nextPos);
			}
			this.drawCode(code39Hash['*']+'0',nextPos);
		},
		/**
		 * show code value for current barcode, set to null to use default render
		 */
		showCode: null,
		/**
		 * share function among all chart object. Corresponse to the prototype of a function (class).
		 * to use the properties of the object.
		 */
		prototype: {}
	};
	$.jBarCode.register(code39Render);
	//============================constant=====================
	var code39Hash = {"0":"101000111011101","1":"111010001010111","2":"101110001010111","3":"111011100010101","4":"101000111010111","5":"111010001110101","6":"101110001110101","7":"101000101110111","8":"111010001011101","9":"101110001011101","A":"111010100010111","B":"101110100010111","C":"111011101000101","D":"101011100010111","E":"111010111000101","F":"101110111000101","G":"101010001110111","H":"111010100011101","I":"101110100011101","J":"101011100011101","K":"111010101000111","L":"101110101000111","M":"111011101010001","N":"101011101000111","O":"111010111010001","P":"101110111010001","Q":"101010111000111","R":"111010101110001","S":"101110101110001","T":"101011101110001","U":"111000101010111","V":"100011101010111","W":"111000111010101","X":"100010111010111","Y":"111000101110101","Z":"100011101110101","-":"100010101110111",".":"111000101011101"," ":"100011101011101","$":"100010001000101","/":"100010001010001","+":"100010100010001","%":"101000100010001","*":"100010111011101"};
})(jQuery);
/**
 * This is how to generate code39Hash
 * from http://en.wikipedia.org/wiki/Code_39
 * 
 */
/*

get a and b from
$("#code39 td:nth-child(2)").each(function(i,e){b.push($(e).text())});
$("#code39 td:nth-child(3)").each(function(i,e){a.push($(e).text())});

var a = ["NnNwWnWnN", "WnNwNnNnW", "NnWwNnNnW", "WnWwNnNnN", "NnNwWnNnW", "WnNwWnNnN", "NnWwWnNnN", "NnNwNnWnW", "WnNwNnWnN", "NnWwNnWnN", "WnNnNwNnW", "NnWnNwNnW", "WnWnNwNnN", "NnNnWwNnW", "WnNnWwNnN", "NnWnWwNnN", "NnNnNwWnW", "WnNnNwWnN", "NnWnNwWnN", "NnNnWwWnN", "WnNnNnNwW", "NnWnNnNwW", "WnWnNnNwN", "NnNnWnNwW", "WnNnWnNwN", "NnWnWnNwN", "NnNnNnWwW", "WnNnNnWwN", "NnWnNnWwN", "NnNnWnWwN", "WwNnNnNnW", "NwWnNnNnW", "WwWnNnNnN", "NwNnWnNnW", "WwNnWnNnN", "NwWnWnNnN", "NwNnNnWnW", "WwNnNnWnN", "NwWnNnWnN", "NwNwNwNnN", "NwNwNnNwN", "NwNnNwNwN", "NnNwNwNwN", "NwNnWnWnN"];
var b = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", ".", " ", "$", "/", "+", "%", "*"];
var hash = {};
var map = {'N':'1','W':'111','w':'000','n':'0'};
for(var i = 0; i< a.length; i++){
	var codes = a[i];
	var t = '';
	for(var j=0;j<codes.length;j++){
		var code = codes.charAt(j);
		t += map[code];
	}
	hash[b[i]] = t;
}
JSON.stringify(hash);

*/