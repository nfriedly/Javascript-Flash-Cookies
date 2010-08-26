SwfStore is a JavaScript library for cross-domain flash cookies. It includes a flash object that maps an External Interface to a Local Storage Object.

Getting-started instructions: http://nfriedly.com/techblog/2010/07/swf-for-javascript-cross-domain-flash-cookies/ 

Working example: http://nfriedly.github.com/Javascript-Flash-Cookies/

The storage.swf is the compiled LSO (Local Storage Object) flash file.

swfstore.js handles the interaction between javascrpt and flash, it also handles embedding and some basic error checking.

Storage.as is where all the magic happens. I'm not super-great at flash or action script, but I tried to keep things reasonably well documented and wrapped everything in a try-catch. Someone who knows ActionScript better than I do may be able to remove some of the try/catch statements.

The storage.fla is essentially just an empty shell file that points to Storage.as as it's main class.

See example/index.html for a working example that you can put on your site.