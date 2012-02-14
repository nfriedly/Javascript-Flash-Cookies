SwfStore
=======

SwfStore is a JavaScript library for cross-domain flash cookies. It includes a .swf file that handles the storage and a JavaScript interface for loading and communicating with the flash file.

Getting-started instructions: http://nfriedly.com/techblog/2010/07/swf-for-javascript-cross-domain-flash-cookies/ 

Working example: http://nfriedly.github.com/Javascript-Flash-Cookies/

---

Security Warning
----------------

The default storage.swf allows any website to read the data in your flash file. You should avoid storing private information in it. 

It would be wise to edit and recompile the flash file to limit itself to your domain and http/https settings. If you do not have a copy of Adobe Flash, I can do it for you for $5 - email me for details.

---

File Details 
------------

storage.swf is the compiled flash file ready to be embedded in your website. Note the security warning above.

swfstore.min.js - a copy of swfstore.js, minified for your convenience. This and a copy of storage.swf should be all you need to use this on a production website.

swfstore.js handles the interaction between javascrpt and flash, it also handles embedding and some basic error checking.

Storage.as is where all the magic happens. It maps an External Interface to a Local Storage Object. I'm not super-great at flash or action script, but I tried to keep things reasonably well documented and wrapped everything in try-catch statements. Someone who knows ActionScript better than I do may be able to remove some of those.

The storage.fla is essentially just an empty shell file that points to Storage.as as it's main class.

See example/index.html for a working example that you can put on your site.


Changelog
---------

1.7 - 2012-02-14
* Updated JS to use https links to download flashplayer (fixes issue #13)
* Converted readme to markdown

1.6 - 2011-09-13
* Added a minified js file
* Clarified readme somewhat
* No code changes

1.5 - 2011-04-05
* Added Security.allowInsecureDomain("*") to the flash file to allow it to work between http and https urls

1.4 - 2011-04-04
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

1.3 - 2011-04-04
* Fixed two bugs that were coluding together to hide eachother:
* The JS getAll() function was actually calling the getValue() flash function.
* The Flash getAllValues() function had a typo in it that would have thrown an error if it were called.

1.2 - 2011-03-08
* Fixed Isssue 11: JS now immediately stores a dummy value in the flashcookie to work around Flashplayers bug where it sometimes deletes cookies that it thinks are not in use but actually are. 
* Updated demo and example to reflect change
* Tweaked the logger to use the given log level if the console supports it
* Added a little bit of explanatory info to the example html file.

1.1 - 2011-01-01
* Fixed Issue 9: JS now forces .swf onready callback to wait until JS has finished initializing if it fires first.
* Fixed Issue 10: fallback logger now works properly and appends log to bottom of page if no console is found.
* Added version number to library
* Found issue in FlashPlayer where flash cookies can be deleted if two tabs are open, a flash cookie is created in one, then the other is refreshed. Workaround: open only one tab initially.

1.0 - 2010-09-01
* Added getAll() function to read all cookies
* Added more inline documentation

0.7 - 2010-08-26
* Added live examples

0.6 - 2010-07-20
* Fixed Issue 1: Added JS library
* Fixed Issue 3: Added example to source


0.5 - 2010-07-13
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
