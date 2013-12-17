module.exports = function(grunt) {


    //var serverScripts = ['*.js'];
    //var clientScripts = ['public-src/**/*.js'];
    //var allScripts = serverScripts.concat(clientScripts);
    
    grunt.loadNpmTasks('grunt-saucelabs');
    
    // Project configuration.
    grunt.initConfig({
        'saucelabs-jasmine': {
            all: {
                options: {
                    //username: 'saucelabs-user-name', // if not provided it'll default to ENV SAUCE_USERNAME (if applicable)
                    //key: 'saucelabs-key', // if not provided it'll default to ENV SAUCE_ACCESS_KEY (if applicable)
                    urls: ['http://localhost:8000/tests/SpecRunner.html'],
                    concurrency: 2, //'Number of concurrent browsers to test against. Will default to the number of overall browsers specified. Check your plan (free: 2, OSS: 3) and make sure you have got sufficient Sauce Labs concurrency.',
                    detailedError: true, //'false (default) / true; if true log detailed test results when a test error occurs',
                    testname: 'SwfStore',
                    browsers: [
                        {
                            browserName: 'internet explorer',
                            version: '11',
                            platform: 'Windows 8.1'
                        }, {
                            browserName: 'internet explorer',
                            version: '10',
                            platform: 'Windows 8'
                        }, {
                            browserName: 'internet explorer',
                            version: '9',
                            platform: 'Windows 7'
                        }, {
                            browserName: 'internet explorer',
                            version: '8',
                            platform: 'Windows XP'
                        }, {
                            browserName: 'internet explorer',
                            version: '7',
                            platform: 'Windows XP'
                        }, {
                            browserName: 'internet explorer',
                            version: '6',
                            platform: 'Windows XP'
                        }, {
                            browserName: 'firefox'
                        }, {
                            browserName: 'chrome'
                        }, {
                            browserName: 'safari'
                        }, {
                            browserName: 'opera'
                        }
                    ]
                }
            }
        }
    });

    grunt.registerTask('test', ['saucelabs-jasmine'])

}