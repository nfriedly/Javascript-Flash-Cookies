/**
* SwfStore by Nathan Friedly http://nfriedly.com
*
* http://github.com/nfriedly/Javascript-Flash-Cookies
*/

(function(){
	var counter = 0; // a counter for element id's and whatnot
	
	var alpnum = /[^a-z0-9_]/ig; //a regex to find anything thats not letters and numbers
	
	function checkData(data){
		if(typeof data == "function"){
			throw 'SwfStore Error: Functions cannot be used as keys or values.';
		}
	}

	/**
	* SwfStore constructor - creates a new SwfStore object and embeds the .swf into the web page.
	*
	* usage: 
	* var mySwfStore = new SwfStore(config);
	*
	* @param {object} config
	* @param {functon} [config.onready] Callback function that is fired when the SwfStore is loaded. Recommended.
	* @param {function} [config.onerror] Callback function that is fired if the SwfStore fails to load. Recommended.
	* @param {string} [config.namespace="swfstore"] The namespace to use in both JS and the SWF. Allows a page to have more than one instance of SwfStore.
	* @param {integer} [config.timeout=10] The number of seconds to wait before assuming the user does not have flash.
	* @param {boolean} [config.debug=false] Is debug mode enabled? If so, mesages will be logged to the console and the .swf will be rendered on the page (although it will be an empty white box unless it cannot communicate with JS. Then it will log errors to the .swf)
	*/
 	window.SwfStore = function(config){
		this.config = config || {};
		var namespace = this.namespace = config.namespace.replace(alpnum, '_') || "swfstore",
			debug = config.debug || false
			timeout = config.timeout || 10; // how long to wait before assuming the store.swf failed to load (in seconds)
	
		// a couple of basic timesaver functions
		function id(){
			return "SwfStore_" + namespace + "_" +  (counter++);
		}
		
		function div(visible){
			var d = document.createElement('div');
			document.body.appendChild(d);
			d.id = id();
			if(!visible){
				// setting display:none causes the .swf to not render at all
				d.style.position = "absolute";
				d.style.top = "0px";
				d.style.left = "-2000px";
			}
			return d;
		}
	
		// get a logger ready if appropriate
		if(debug){
			// if we're in a browser that doesn't have a console, build one
			if(typeof console == "undefined"){
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
				source = (source == 'swfStore') ? 'swf' : source;
				console.log('SwfStore - ' + namespace + ": " + type + ' (' + source  + '): ' + msg);
			}
		} else {
			this.log = function(){}; // if we're not in debug, then we don't need to log anything
		}
	
		this.log('info','js','Initializing...');
	
		// the callback functions that javascript provides to flash must be globally accessible
		SwfStore[namespace] = this;
	
		var swfContainer = div(debug);
		
		var swfName = id();
		
		var flashvars = "logfn=SwfStore." + namespace + ".log&amp;" + 
			"onload=SwfStore." + namespace + ".onload&amp;" +  // "onload" sets this.ready and then calls the "onready" config option
			"onerror=SwfStore." + namespace + ".onerror";
			
		swfContainer.innerHTML = 
			'<object height="100" width="500" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + 
			swfName + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' +
			'	<param value="' + config.swf_url + '" name="movie">' + 
			'	<param value="' + flashvars + '" name="FlashVars">' +
			'	<param value="always" name="allowScriptAccess">' +
			'	<embed height="375" align="middle" width="500" pluginspage="http://www.macromedia.com/go/getflashplayer" ' +
			'flashvars="' + flashvars + '" type="application/x-shockwave-flash" allowscriptaccess="always" quality="high" loop="false" play="true" ' +
			'name="' + swfName + '" bgcolor="#ffffff" src="' + config.swf_url + '">' +
			'</object>';
		
		this.swf = 	document[swfName] || window[swfName];
		
		this._timeout = setTimeout(function(){
			SwfStore[namespace].log('Timeout reached, assuming the store.swf failed to load and firing the onerror callback.');
			if(config.onerror){
				config.onerror();
			}
		}, timeout * 1000);
	}

	SwfStore.prototype = {
		
		/**
		* This is an indicator of wether or not the SwfStore is initialized. 
		* Use the onready and onerror config options rather than checking this variable.
		*/
		ready: false,
		
		/**
		* This is to ensure that SwfStore was instantiated correctly and not called statically.
		* The namespace will be overwritten by the one provided in the config, or a default of "swfstore"
		* Flash also uses this to name it's LSO
		*/
		namespace: 'SwfStore_prototype', 

		/**
		* Sets the given key to the given value in the swf
		* @param {string} key
		* @param {string} value
		*/
		set: function(key, value){
			if(this.namespace === SwfStore.prototype.namespace ){
				throw 'Create a new SwfStore to set data';
			}
			if(this.ready){
				checkData(key);
				checkData(value);
				//this.log('debug', 'js', 'Setting ' + key + '=' + value);
				this.swf.set(key, value);
			} else {
				throw 'Attempted to save to uninitialized SwfStore.';
			}
		},
	
		/**
		* Retrieves the specified value from the swf.
		* @param {string} key
		* @return {string} value
		*/
		get: function(key){
			if(this.namespace === SwfStore.prototype.namespace ){
				throw 'Create a new SwfStore to set data';
			}
			if(this.ready){
				checkData(key);
				//this.log('debug', 'js', 'Reading ' + key);
				return this.swf.get(key);
			} else {
				throw 'Attempted to read from an uninitialized SwfStore.';
			}
		},

		/**
		* Retrieves all stored values from the swf. 
		* @return {object}
		*/
		getAll: function(key){
			if(this.namespace === SwfStore.prototype.namespace ){
				throw 'Create a new SwfStore to set data';
			}
			if(this.ready){
				checkData(key);
				//this.log('debug', 'js', 'Reading ' + key);
				return this.swf.get(key);
			} else {
				throw 'Attempted to read from an uninitialized SwfStore.';
			}
		},
		
		/**
		* This is the function that the swf calls to announce that it has loaded.
		* This function in turn fires the onready function if provided in the config.
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
		*/
		onerror: function(){
			clearTimeout(this._timeout);
			//this.log('info', 'js', 'Error reported by storage.swf');
			if(this.config.onerror){
				this.config.onerror();
			}
		}
		
	}
}());