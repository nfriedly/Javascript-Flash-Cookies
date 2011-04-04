SwfStore is a JavaScript library for cross-domain flash cookies. It includes a flash object that maps an External Interface to a Local Storage Object.

Getting-started instructions: http://nfriedly.com/techblog/2010/07/swf-for-javascript-cross-domain-flash-cookies/ 

Working example: http://nfriedly.github.com/Javascript-Flash-Cookies/


=======
File Details 
=======

The storage.swf is the compiled LSO (Local Storage Object) flash file.

swfstore.js handles the interaction between javascrpt and flash, it also handles embedding and some basic error checking.

Storage.as is where all the magic happens. I'm not super-great at flash or action script, but I tried to keep things reasonably well documented and wrapped everything in a try-catch. Someone who knows ActionScript better than I do may be able to remove some of the try/catch statements.

The storage.fla is essentially just an empty shell file that points to Storage.as as it's main class.

See example/index.html for a working example that you can put on your site.


=======
Changelog
=======

1.3 - 2011-4-4
* Fixed two bugs that were coluding together to hide eachother:
  * The JS getAll() function was actually calling the getValue() flash function.
  * The Flash getAllValues() function had a typo in it that would have thrown an error if it were called.

1.2 - 2011-3-8
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