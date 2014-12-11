SwfStore
=======

SwfStore is a JavaScript library for cross-domain flash cookies. It includes a .swf file that handles the
storage and a JavaScript interface for loading and communicating with the flash file.

Getting-started instructions: http://nfriedly.com/techblog/2010/07/swf-for-javascript-cross-domain-flash-cookies/

Working example: http://nfriedly.github.io/Javascript-Flash-Cookies/

[![Build Status](https://travis-ci.org/nfriedly/Javascript-Flash-Cookies.svg?branch=master)](https://travis-ci.org/nfriedly/Javascript-Flash-Cookies)

---

IMPORTANT SECURITY NOTICE
=========================
Versions 1.9 and older are vulnerable to a XSS attack. Please upgrade to 1.9.1 or newer immediately!


General Security Warning
----------------

The default storage.swf allows any website to read the data in your flash file. You should avoid storing private
information in it.

It would be wise to edit and recompile the flash file to limit itself to your domain and http/https settings. (See [src/Storage.as around line 93](https://github.com/nfriedly/Javascript-Flash-Cookies/blob/master/src/Storage.as#L93).)
You can do this yourself with Adobe Flash or the Apache Flex SDK (free) or I can do it for you for $5 - email me for details.

---

Tested for compatibility with the following browsers:

[![Selenium Test Status](https://saucelabs.com/browser-matrix/jsfc.svg)](https://saucelabs.com/u/jsfc)

(It also works well in Chrome, but there's an [issue with running automated tests in Chrome](https://github.com/nfriedly/Javascript-Flash-Cookies/issues/23).)

Note: SwfStore is *not* compatible with most mobile devices (iPhones, Androids, etc) because it requires flash and few of these devices run flash.

Installation via [Bower](http://bower.io/)
--------------------------

    bower install javascript-flash-cookies

Basic Usage
-----------

```javascript
// this should run on DOMReady, or at least after the opening <body> tag has been parsed.
var mySwfStore = new SwfStore({
  namespace: "my_cool_app",
  swf_url: "http://example.com/path/to/storage.swf",
  onready: function() {
    var myValue = prompt('What data would you like to store in my_key?');
    mySwfStore.set('my_key', myValue);
    console.log('my_key is now set to ' + mySwfStore.get('my_key'));
  },
  onerror: function() {
    console.error('swfStore failed to load :(');
  }
});
```

Default configuration options
---------------------

```js
{
    swf_url: 'storage.swf', // this should be a complete protocol-relative url (//example.com/path/to/storage.swf) for cross-domain, cross-protocol usage
    namespace: 'swfstore', // allows for multiple instances of SwfStore on the same page without clobbering eachother
    debug: false, // true logs to the console, or creates a <div> on the page is no console is available.
    timeout: 10, // number of seconds to wait before concluding there was an error
    onready: null, // callback function for a successful loading
    onerror: null // callback function for when there was an err in loading
}
```

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
* Add support for AMD / CommonJS
* Figure out how to run automated cross-domain & cross-protocol tests
* update demo
* Look into http://karma-runner.github.io/ or http://theintern.io/ or similar to automate local testing.
* Sourcemap
* Update to latest Jasmine
* Fix automated Chrome tests

Changelog
---------

### 2.0.0 - (coming soon)

Breaking changes:
* Removed version number from JS
* Removed LSOPath and LSOName params - they were buggy and unused. Path is fixed to / and LSOName is forced to namespace. fixes https://github.com/nfriedly/Javascript-Flash-Cookies/issues/22

Other Changes
* Moved compiled files to dist/
* Automated testing on saucelabs
* Automated .swf compiling with Apache Flex
* Moved compiled files to dist/
* Added a clearAll() method
* Fixed https://github.com/nfriedly/Javascript-Flash-Cookies/issues/21
* Stopped letting `console` pollyfill leak into global scope
* Fixed bug where `set(key, null)` does nothing

### 1.9.1 - 2014-04-28
* Fixed a XSS vulnerability
* Small changes to Gruntfile to make testing easier
* Switched to semver

### 1.9 - 2013-08-30
* Refactored the ActionScript to call flush after both setValue and clearValue (fixes issue #18/#19)

### 1.8 - 2012-03-27
* Added support for setting the LSOPath to allow other .swf files to read & write SwfStore's objects

### 1.7 - 2012-02-14

* Updated JS to use https links to download flashplayer (fixes issue #13)
* Converted readme to markdown

### 1.6 - 2011-09-13

* Added a minified js file
* Clarified readme somewhat
* No code changes

### 1.5 - 2011-04-05

* Added Security.allowInsecureDomain("*") to the flash file to allow it to work between http and https urls

### 1.4 - 2011-04-04

* Added .clear(key) support to js to delete keys from flash
* Removed prototype check from JS, and combined all .ready checks into a single _checkReady() function
* Renamed a few items in the SWF to be more consistent
* Changed the style.display.top to -2000px for the swf container when debug is off because at 0px it was affecting popup windows.
* Fixed several namespace-related bugs in both JS and the swf; previously the swf had *always* been using the "SwfStore" namespace reguardless of the JS
* Added sane defaults & reworked how the config is handled
* Now throws an error if two instances are initialized with the same namespace
* Added "use strict";
* Tweaked JS to pass http://jslint.org/
* getAll() function does not include the __FlashBugFix value that was added in 1.2

### 1.3 - 2011-04-04

* Fixed two bugs that were coluding together to hide eachother:
* The JS getAll() function was actually calling the getValue() flash function.
* The Flash getAllValues() function had a typo in it that would have thrown an error if it were called.

### 1.2 - 2011-03-08

* Fixed Isssue 11: JS now immediately stores a dummy value in the flashcookie to work around Flashplayers bug where it sometimes deletes cookies that it thinks are not in use but actually are.
* Updated demo and example to reflect change
* Tweaked the logger to use the given log level if the console supports it
* Added a little bit of explanatory info to the example html file.

### 1.1 - 2011-01-01

* Fixed Issue 9: JS now forces .swf onready callback to wait until JS has finished initializing if it fires first.
* Fixed Issue 10: fallback logger now works properly and appends log to bottom of page if no console is found.
* Added version number to library
* Found issue in FlashPlayer where flash cookies can be deleted if two tabs are open, a flash cookie is created in one, then the other is refreshed. Workaround: open only one tab initially.

### 1.0 - 2010-09-01

* Added getAll() function to read all cookies
* Added more inline documentation

### 0.7 - 2010-08-26

* Added live examples

### 0.6 - 2010-07-20

* Fixed Issue 1: Added JS library
* Fixed Issue 3: Added example to source

### 0.5 - 2010-07-13

* Initial commit: included .swf file, readme, and MIT license


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
