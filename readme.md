SwfStore
=======

SwfStore is a JavaScript library for cross-domain flash cookies. It includes a .swf file that handles the
storage and a JavaScript interface for loading and communicating with the flash file.

Working example: https://nfriedly.github.io/Javascript-Flash-Cookies/ and http://nfriedly.com/stuff/swfstore-example/

[![Bower package](http://badge.fury.io/bo/javascript-flash-cookies.svg)](http://bower.io/search/?q=flash%20cookies)
[![Build Status](https://travis-ci.org/nfriedly/Javascript-Flash-Cookies.svg?branch=master)](https://travis-ci.org/nfriedly/Javascript-Flash-Cookies)

---

Security Warning
----------------

The default storage.swf allows any website to read the data in your flash file. You should avoid storing private
information in it.

It would be wise to edit and recompile the flash file to limit itself to your domain and http/https settings. (See [src/Storage.as around line 93](https://github.com/nfriedly/Javascript-Flash-Cookies/blob/master/src/Storage.as#L93).)
You can do this yourself with Adobe Flash or the Apache Flex SDK (free) or I can do it for you for $5 - email me for details.

Finally, versions older than 1.9.1 are vulnerable to a XSS attack and should not be used.

Compatibility
--------------

Requires Flash Player 9.0.31.0 or newer. Tested for compatibility with the following browsers:

[![Selenium Test Status](https://saucelabs.com/browser-matrix/jsfc.svg)](https://saucelabs.com/u/jsfc)

(It also should work in older IE and Safari's, but the tests don't.)

Note: SwfStore is *not* compatible with most mobile devices (iPhones, Androids, etc) because it requires flash and few of these devices run flash.

Installation
 
Via [Bower](http://bower.io/):

    bower install --save flash-cookies
    
Or install via [npm](https://npmjs.com/) (for use with [browserify](https://www.npmjs.com/package/browserify):

    npm install --save flash-cookies
    
Note: it's up to you to ensure that the `storage.swf` file is available, Browserify won't make it public by default.

Basic Usage
-----------

```javascript
// this should run on DOMReady, or at least after the opening <body> tag has been parsed.
var mySwfStore = new SwfStore({
  namespace: "my_cool_app",
  swf_url: "//example.com/path/to/storage.swf",
  onready: function() {
    mySwfStore.set('key', 'value');
    console.log('key is now set to ' + mySwfStore.get('key'));
  },
  onerror: function() {
    console.error(err.message);
  }
});
```

A more thorough example is also available at http://nfriedly.com/techblog/2010/07/swf-for-javascript-cross-domain-flash-cookies/

Configuration options
---------------------

* **swf_url**: URL to included `storage.swf` file. All sites/pages using SwfStore should have the exact same url here for cross-domain usage, and it should be a protocol-relative url (just // instead of http:// or https://) for cross-protocol usage.
* **namespace**: Namespace used both internally for the JS object and for the LocalStorage Object (cookie). May contain forward slash (`/`) but all other special characters will be replaced with `_`
* **debug** Set to true to log debug information to the browser console (Automatically creates a logging `<div>` on the page if no console is available.)
* **timeout**: Number of seconds to wait before concluding there was an error. Defaults to `10`.
* **onready**: Callback function to fire once SwfStore is loaded and ready. No arguments.
* **onerror**: Callback function to fire in the event of an error. Passes an `Error` object as the first argument.

API
---

Instance methods:

* **`get(key)`**: Returns the value for `key` as a String or `null` if the key is not set.
* **`set(key, value)`**: Sets `key` to `value`.
* * Note: setting a `key` to `null` or `undefined` is equivalent to `clear()`ing it.
* **`clear(key)`**: Deletes the value for `key` if it exists.
* **`getAll()`**: Returns a Object in the form of `{key: value}` with all data stored in the .swf.
* **`clearAll()`**: Clears all data from the .swf.
* **`ready`**: Boolean to indicate whether or not the .swf has loaded and is ready for access.
* * Note: providing an `onready` callback to the config is recommended over checking the `.ready` property.

Troubleshooting
---------------
 * Be sure the urls to the .swf file and .js file are both correct.
 * If the .swf file is unable to communicate with the JavaScript, it will display log messages on the flash object. If debug is enabled, this should be visible on the page.
 * To hide the flash object and disable the log messages appending to the bottom of the page, set `debug: false` in the configuration options. (Log messages are added to a `<div>` if no browser `console` is available).
 * If the user does not have flash installed, the onerror function will be called after a (configurable) 10 second timeout. You may want to use a library such as [Flash Detect](http://www.featureblend.com/javascript-flash-detection-library.html) to check for this more quickly. Flash Player 9.0.31.0 or newer is required.
 * If you pass a non-string data as the key or value, things may break. Your best bet is to use strings and/or use JSON to encode objects as strings.
 * If you see the error `uncaught exception: Error in Actionscript. Use a try/catch block to find error., try using // in the .swf URL rather than https://. See https://github.com/nfriedly/Javascript-Flash-Cookies/issues/14 for more information.
 * Do not set display:none on the swf or any of its parent elements, this will cause the file to not render and the timeout will be fired. Disable debug and it will be rendered off screen.
 * The error this.swf.set is not a function has been known to occur when the FlashFirebug plugin is enabled in Firefox / Firebug.
 * This library is not sutable for storing large amounts of data because the .swf is normally rendered off screen and thus there is no way for the user to respond to Flash's prompt to increase the storage limit. 


File Details
------------

storage.swf is the compiled flash file ready to be embedded in your website. Note the security warning above.

swfstore.min.js - a copy of swfstore.js, minified for your convenience. This and a copy of storage.swf should
be all you need to use this on a production website.

swfstore.js handles the interaction between javascrpt and flash, it also handles embedding and some basic error
checking.

Storage.as is where all the magic happens. It maps an External Interface to a Local Storage Object. I'm not
super-great at flash or action script, but I tried to keep things reasonably well documented and wrapped
everything in try-catch statements. Someone who knows ActionScript better than I do may be able to remove some
of those.

The storage.fla is essentially just an empty shell file that points to Storage.as as it's main class.

See example/index.html for a working example that you can put on your site.

Compiling
---------

### .js
This project uses [UglifyJS2](https://github.com/mishoo/UglifyJS2) via the [Grunt](http://gruntjs.com/) plugin. Setup:

* Install [Node.js](http://nodejs.org/)
* Install Grunt globally: `npm install -g grunt`
* `cd` into the project directory and install the dependencies: `npm install`
* Run `grunt uglify` to "compile" (minify) the JavaScript.

### .swf
This .swf can be compiled using Adobe Flash (paid) or the Apache Flex SDK (free).

With Adobe Flash, open `src/storage.fla` and export it to `dist/storage.swf`

Grunt is set up to use Apache Flex via the [grunt-swf](https://github.com/nfriedly/grunt-swf) plugin.
The plugin is installed via the standard `npm install` but the SDK must be installed separately.

See `flex-sdk/instructions.md` or https://github.com/nfriedly/grunt-swf#installing-the-apache-flex-sdk for more details on installing the Flex SDK.

Then run `grunt swf` to compile the .swf.

Tip: `grunt build` will compile both the .js and the .swf.

(Note: on Windows, Git Bash may give better results than the windows command prompt.)

Contributors
------------
* Nathan Friedly - http://nfriedly.com
* Alexandre Mercier - https://twitter.com/alemercier
* Andy Garbutt - https://twitter.com/techsplicer


Release process
---------------
* Update the the changelog in the readme
* Compile anything that's changed (see the Compiling section above)
* Commit everything
* Run `npm version [major | minor | patch ]` with the appropriate flag (Ssee http://semver.org/ for details)
* Push to Github


To Do
-----
* Figure out how to run automated cross-domain & cross-protocol tests
* update demo
* Look into http://karma-runner.github.io/ or http://theintern.io/ or similar to automate local testing.
* Sourcemap
* Make automated tests less flakey

Changelog
---------

See [history.md](./history.md)

MIT License
-----------

Copyright (c) 2010 by Nathan Friedly - http://nfriedly.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
