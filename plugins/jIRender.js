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
	var iRender = {
		/**
		 * type of chart will be render when user call. Array of all types that the plugin able to handle.
		 */
		types: ["newBarCodeType"],
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
		init: function(){},
		/**
		 * Validate data before rendering. It call before object created
		 */
		validate: function(code,type){},
		/**
		 * generate bar code, need to handler all type of bar codes declare in the 
		 */
		generate: function(){},
		/**
		 * show code value for current barcode, set to null to use default render
		 */
		showCode: function(){},
		/**
		 * share function among all chart object. Corresponse to the prototype of a function (class).
		 * to use the properties of the object.
		 */
		prototype: {}
	};
	$.jBarCode.register(iRender);
	
})(jQuery);