/**
* SwfStore - a JavaScript library for cross-domain flash cookies
*
* http://github.com/nfriedly/Javascript-Flash-Cookies
*
* Copyright (c) 2010 by Nathan Friedly - Http://nfriedly.com
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

/*jslint browser: true, devel: true*/
/*globals SwfStore */

(function(){

	"use strict"; // http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

	var counter = 0; // a counter for element id's and whatnot
	
	var alpnum = /[^a-z0-9_]/ig; //a regex to find anything thats not letters and numbers

	/**
	* SwfStore constructor - creates a new SwfStore object and embeds the .swf into the web page.
	*
	* usage: 
	* var mySwfStore = new SwfStore(config);
	*
	* @param {object} config
	* @param {string} [config.swf_url=storage.swf] - Url to storage.swf. Must be an absolute url (with http:// and all) to work cross-domain
	* @param {functon} [config.onready] Callback function that is fired when the SwfStore is loaded. Recommended.
	* @param {function} [config.onerror] Callback function that is fired if the SwfStore fails to load. Recommended.
	* @param {string} [config.namespace="swfstore"] The namespace to use in both JS and the SWF. Allows a page to have more than one instance of SwfStore.
	* @param {integer} [config.timeout=10] The number of seconds to wait before assuming the user does not have flash.
	* @param {boolean} [config.debug=false] Is debug mode enabled? If so, mesages will be logged to the console and the .swf will be rendered on the page (although it will be an empty white box unless it cannot communicate with JS. Then it will log errors to the .swf)
	*/
	window.SwfStore = function(config){
		// make sure we have something of a configuration
		config = config || {};
		var defaults = {
			swf_url: 'storage.swf',
			namespace: 'swfstore',
			debug: false,
			timeout: 10,
			onready: null,
			onerror: null
		};
		var key;
		for(key in defaults){
			if(defaults.hasOwnProperty(key)){
				if(!config.hasOwnProperty(key)){
					config[key] = defaults[key];
				}
			}
		}
		config.namespace = config.namespace.replace(alpnum, '_');
		
		if(window.SwfStore[config.namespace]){
			throw "There is already an instance of SwfStore using the '" + config.namespace + "' namespace. Use that instance or specify an alternate namespace in the config.";
		}
		
		this.config = config;
		
		// a couple of basic timesaver functions
		function id(){
			return "SwfStore_" + config.namespace + "_" +  (counter++);
		}
		
		function div(visible){
			var d = document.createElement('div');
			document.body.appendChild(d);
			d.id = id();
			if(!visible){
				// setting display:none causes the .swf to not render at all
				d.style.position = "absolute";
				d.style.top = "-2000px";
				d.style.left = "-2000px";
			}
			return d;
		}
	
		// get a logger ready if appropriate
		if(config.debug){
			// if we're in a browser that doesn't have a console, build one
			if(typeof console === "undefined"){
				var loggerOutput = div(true);
				window.console = {
					log: function(msg){
						var m = div(true);
						m.innerHTML = msg;
						loggerOutput.appendChild(m);
					}
				};
			}
			this.log = function(type, source, msg){
				source = (source === 'swfStore') ? 'swf' : source;
				if(typeof(console[type]) !== "undefined"){
					console[type]('SwfStore - ' + config.namespace + ' (' + source + '): ' + msg);
				} else {
					console.log('SwfStore - ' + config.namespace + ": " + type + ' (' + source  + '): ' + msg);
				}
			};
		} else {
			this.log = function(){}; // if we're not in debug, then we don't need to log anything
		}
	
		this.log('info','js','Initializing...');
	
		// the callback functions that javascript provides to flash must be globally accessible
		SwfStore[config.namespace] = this;
	
		var swfContainer = div(config.debug);
		
		var swfName = id();
		
		var flashvars = "logfn=SwfStore." + config.namespace + ".log&amp;" + 
			"onload=SwfStore." + config.namespace + ".onload&amp;" +  // "onload" sets this.ready and then calls the "onready" config option
			"onerror=SwfStore." + config.namespace + ".onerror&amp;" + 
			"LSOName=" + config.namespace;
			
		swfContainer.innerHTML = '<object height="100" width="500" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + 
			swfName + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' +
			'	<param value="' + config.swf_url + '" name="movie">' + 
			'	<param value="' + flashvars + '" name="FlashVars">' +
			'	<param value="always" name="allowScriptAccess">' +
			'	<embed height="375" align="middle" width="500" pluginspage="http://www.macromedia.com/go/getflashplayer" ' +
			'flashvars="' + flashvars + '" type="application/x-shockwave-flash" allowscriptaccess="always" quality="high" loop="false" play="true" ' +
			'name="' + swfName + '" bgcolor="#ffffff" src="' + config.swf_url + '">' +
			'</object>';
		
		this.swf = document[swfName] || window[swfName];
		
		this._timeout = setTimeout(function(){
			SwfStore[config.namespace].log('error','js','Timeout reached, assuming ' + config.swf_url + ' failed to load and firing the onerror callback.');
			if(config.onerror){
				config.onerror();
			}
		}, config.timeout * 1000);
	};
	
	// we need to check everything we send to flash because it can't take functions as arguments
	function checkData(data){
		if(typeof data === "function"){
			throw 'SwfStore Error: Functions cannot be used as keys or values.';
		}
	}

	SwfStore.prototype = {
  
		version: "1.5",
		
		/**
		* This is an indicator of wether or not the SwfStore is initialized. 
		* Use the onready and onerror config options rather than checking this variable.
		*/
		ready: false,

		/**
		* Sets the given key to the given value in the swf
		* @param {string} key
		* @param {string} value
		*/
		set: function(key, value){
			this._checkReady();
			checkData(key);
			checkData(value);
			//this.log('debug', 'js', 'Setting ' + key + '=' + value);
			this.swf.set(key, value);
		},
	
		/**
		* Retrieves the specified value from the swf.
		* @param {string} key
		* @return {string} value
		*/
		get: function(key){
			this._checkReady();
			checkData(key);
			//this.log('debug', 'js', 'Reading ' + key);
			return this.swf.get(key);
		},

		/**
		* Retrieves all stored values from the swf. 
		* @return {object}
		*/
		getAll: function(){
			this._checkReady();
			//this.log('debug', 'js', 'Reading ' + key);
			var data = this.swf.getAll();
			// presumably the user wants to loop through their values, not including the internal __flashBugFix value
			if(data.__flashBugFix){
				delete data.__flashBugFix;
			}
			return data;
		},
    
	    /**
		* Delete the specified key from the swf
		*
		* @param {string} key
		*/
		clear: function(key){
			this._checkReady();
			checkData(key);
			this.swf.clear(key);
		},
		
		/**
		* We need to run this check before tying to work with the swf
		*
		* @private
		*/
		_checkReady: function(){
			if(!this.ready){
				throw 'SwfStore is not yet finished initializing. Pass a config.onready callback or wait until this.ready is true before trying to use a SwfStore instance.';
			}
		},
		
		/**
		* This is the function that the swf calls to announce that it has loaded.
		* This function in turn fires the onready function if provided in the config.
		*
		* @private
		*/
		"onload": function(){
			// deal with scope the easy way
			var that = this;
			// wrapping everything in a timeout so that the JS can finish initializing first
			// (If the .swf is cached in IE, it fires the callback *immediately* before JS has 
			// finished executing.  setTimeout(function, 0) fixes that)
			setTimeout(function(){
			  clearTimeout(that._timeout);
			  that.ready = true;
			  
			  // There is a bug in flash player where if no values have been saved and the page is 
			  // then refreshed, the flashcookie gets deleted - even if another tab *had* saved a
			  // value to the flashcookie.
			  // So to fix, we immediately save something
			  that.set('__flashBugFix','1');
			  
			  //this.log('info', 'js', 'Ready!')
			  if(that.config.onready){
			    that.config.onready();
			  }
			}, 0);
		},
		
		
		/**
		* If the swf had an error but is still able to communicate with JavaScript, it will call this function.
		* This function is also called if the time limit is reached and flash has not yet loaded.
		* This function is most commonly called when either flash is not installed or local storage has been disabled.
		* If an onerror function was provided in the config, this function will fire it.
		*
		* @private
		*/
		onerror: function(){
			clearTimeout(this._timeout);
			//this.log('info', 'js', 'Error reported by storage.swf');
			if(this.config.onerror){
				this.config.onerror();
			}
		}
		
	};
}());