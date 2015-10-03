SwfStore History / Changelog
============================

### 2.2.2 - 2015-10-02
* Fixed bug where swf would return prototype properties of storage object instead of correctly returning `null` #35 

### 2.2.1 - 2015-08-05
* Ensure library is always a global regardless of UMD (required for communication with flash)

### 2.2.0 - 2015-08-04
* Fixed bugs when namespace contains multiple slashes
* Ensured onerror callback is always given an Error object with a useful message
* Adding UMD for requireJS/Browserfy/etc.
* Added to npm registry for browserify support
* Removed "javascript" from library name

### 2.1.0 - 2014-12-17
 * Modified SWF to check for new values at every read - see https://github.com/nfriedly/Javascript-Flash-Cookies/pull/29 & https://github.com/nfriedly/Javascript-Flash-Cookies/issues/24

### 2.0.2 - 2014-12-11
 * Added support for forward slashes (/) in the namespace - https://github.com/nfriedly/Javascript-Flash-Cookies/pull/28
 * Testing improvements in progress, but automated tests are currently broken

### 2.0.1 - 2014-11-12
* Updated bower name to conform to url-friendly requirement

### 2.0.0 - 2014-11-12

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
* Listed in bower

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
