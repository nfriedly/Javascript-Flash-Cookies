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

package {
    import flash.display.Sprite;
	import flash.display.Stage;
    import flash.events.*;
    import flash.external.ExternalInterface;
    import flash.text.TextField;
	import flash.system.Security;
    import flash.net.SharedObject;
    import flash.net.SharedObjectFlushStatus;

    public class Storage extends Sprite {
		
		/**
		* Our Local Shared Object (LSO) - this is where all the magic happens!
		*/
		private var dataStore:SharedObject;
		
		/**
		* The name of LSO
		*/
		private var LSOName:String = "SwfStore";
		
		/**
		* The JS function to call for logging.
		* Should be specified as "logfn" in the flashvars
		*/
		private var logFn:String;
		
		/**
		* Text field used by local logging
		*/
		private var logText:TextField;

		/**
		* Constructor, sets up everything and logs any errors.
		* Call this automatically by setting Publish > Class tp "Storage" in your .fla properties.
		*
		*
		*
		* If javascript is unable to access this object and not recieving any log messages (at wh
		*/
        public function Storage() {
			// Make sure we can talk to javascript at all
            if (!ExternalInterface.available) {
				localLog("External Interface is not avaliable! (No communication with JavaScript.) Exiting.");
				return;
			}
			
			// since even logging involves communicating with javascript, 
			// the next thing to do is find the external log function
			if(this.loaderInfo.parameters.logfn){
				logFn = this.loaderInfo.parameters.logfn;
			}
			
			log('Initializing...');
			
			// this is necessary to work cross-domain
			Security.allowDomain("*");
			
			// grab the namespace if supplied
			if(this.loaderInfo.parameters.LSOName){
				LSOName = this.loaderInfo.parameters.LSOName;
			}
			
			// try to initialize our lso
			try{
				dataStore = SharedObject.getLocal(LSOName);
			} catch(error:Error){
				// user probably unchecked their "allow third party data" in their global flash settings
				log('Unable to create a local shared object. Exiting - ' + error.message);
				onError();
				return;
			}
			
			try {
				// expose our external interface
				ExternalInterface.addCallback("set", setValue);
				ExternalInterface.addCallback("get", getValue);
				ExternalInterface.addCallback("getAll", getAllValues);
				ExternalInterface.addCallback("clear", clearValue);
				
				log('Ready! Firing onload if provided');
				
				// if onload was set in the flashvars, assume it's a string function name and call it.
				// (This means that the function must be in the global scope. I'm not sure how to call a scoped function.)
				if(this.loaderInfo.parameters.onload){
					ExternalInterface.call(this.loaderInfo.parameters.onload);
					// and we're done!
				}

			} catch (error:SecurityError) {
				log("A SecurityError occurred: " + error.message + "\n");
				onError()
			} catch (error:Error) {
				log("An Error occurred: " + error.message + "\n");
				onError();
			}
        }
		
		/**
		* Attempts to notify JS when there was an error during initialization
		*/
		private function onError():void {
			try{
				if(ExternalInterface.available && this.loaderInfo.parameters.onerror){
					ExternalInterface.call(this.loaderInfo.parameters.onerror);
				}
			} catch (error:Error){
				log('Error attempting to fire JS onerror callback - ' + error.message);
			}
		}

		/**
		* Saves the data to the LSO, and then flushes it to the disk
		*
		* @param {string} key
		* @param {string} value - Expects a string. Objects will be converted to strings, functions tend to cause problems.
		*/
         private function setValue(key:String, val:*):void {
			try{
				if(typeof val != "string"){
					val = val.toString();
				}
				log('Setting ' + key + '=' + val);
				dataStore.data[key] = val;
			} catch(error:Error){
				log('Unable to save data - ' + error.message);
			}
            
            var flushStatus:String = null;
            try {
                flushStatus = dataStore.flush(10000);
            } catch (error:Error) {
                log("Error...Could not write SharedObject to disk - " + error.message );
            }
            if (flushStatus != null) {
                switch (flushStatus) {
                    case SharedObjectFlushStatus.PENDING:
                        log("Requesting permission to save object...");
                        dataStore.addEventListener(NetStatusEvent.NET_STATUS, onFlushStatus);
                        break;
                    case SharedObjectFlushStatus.FLUSHED:
						// don't really need another message when everything works right
                        //log("Value flushed to disk.");
                        break;
                }
            }
        }
		
		/**
		* Reads and returns data from the LSO
		*/
		private function getValue(key:String):String {
			try{
				log('Reading ' + key);
				return dataStore.data[key];
			} catch(error:Error){
				log('Unable to read data - ' + error.message);
			}
			return null;
		}
        
		/**
		* Deletes an item from the LSO
		*/
        private function clearValue(key:String):void {
            try{
				log("Deleting " + key);
           		delete dataStore.data[key];
			} catch (error:Error){
				log("Error deleting key - " + error.message);
			}
        }

		/** 
		* This retrieves all stored data
		*/
		private function getAllValues():Object {
			return dataStore.data;
		}
		
		/**
		* This happens if the user is prompted about saving locally
		*/
        private function onFlushStatus(event:NetStatusEvent):void {
            log("User closed permission dialog...");
            switch (event.info.code) {
                case "SharedObject.Flush.Success":
                    log("User granted permission -- value saved.");
                    break;
                case "SharedObject.Flush.Failed":
                    log("User denied permission -- value not saved.");
                    break;
            }

            dataStore.removeEventListener(NetStatusEvent.NET_STATUS, onFlushStatus);
        }

		/**
		* Attempts to log messages to the supplied javascript logFn,
		* if that fails it passes them to localLog()
		*/
		private function log(str:String):void {
			if(logFn){
				try{
					ExternalInterface.call(logFn, 'debug', 'swfStore', str);
				} catch(error:Error){
					localLog("Error logging to js: " + error.message);
				} 
			} else {
				localLog(str);
			}
		}
		
		/**
		* Last-resort logging used when communication with javascript fails or isn't avaliable.
		* The messages should appear in the flash object, but they might not be pretty.
		*/
		private function localLog(str:String):void {
			// We can't talk to javascript for some reason. 
			// Attempt to show this to the user (normally this swf is hidden off screen, so regular users shouldn't see it)
			if(!logText){
				// create the text field if it doesn't exist yet
				logText= new TextField();
				logText.width = 450; // I suspect there's a way to do "100%"...
				addChild(logText);
			}
			logText.appendText(str + "\n");
		}
		
    }
}
