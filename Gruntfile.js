/*jshint node: true, browser: false*/
module.exports = function(grunt) {


    //var serverScripts = ['*.js'];
    //var clientScripts = ['public-src/**/*.js'];
    //var allScripts = serverScripts.concat(clientScripts);

    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Project configuration.
    grunt.initConfig({

        uglify: {
            options: {
                mangle: false
            },
            swfstore: {
                files: {
                    'swfstore.min.js': ['src/swfstore.js']
                }
            }
        },

        connect: {
            // runs the server for the duration of the test. 
            uses_defaults: {
                options: {
                    port: 8000,
                    base: './'
                }
            },
            test: {
                options: {}
            },
            serve: {
                options: {
                    keepalive: true
                }
            }
        },

        'saucelabs-jasmine': {
            all: {
                options: {
                    username: 'jsfc', // if not provided it'll default to ENV SAUCE_USERNAME
                    key: '53b0264d-afb9-449c-8dfc-94eff9593511', // if not provided it'll default to ENV SAUCE_ACCESS_KEY
                    urls: ['http://localhost:8000/tests/SpecRunner.html'],
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3, //'Number of concurrent browsers to test against. Will default to the number of overall browsers specified. Check your plan (free: 2, OSS: 3) and make sure you have got sufficient Sauce Labs concurrency.',
                    detailedError: true, //'false (default) / true; if true log detailed test results when a test error occurs',
                    testname: 'SwfStore',
                    browsers: [{
                        browserName: 'internet explorer',
                        version: '11',
                        platform: 'Windows 8.1',
                        tags: ['ie', 'ie11', 'win']
                    }, {
                        browserName: 'internet explorer',
                        version: '10',
                        platform: 'Windows 8',
                        tags: ['ie', 'ie10', 'win']
                    }, {
                        browserName: 'internet explorer',
                        version: '9',
                        platform: 'Windows 7',
                        tags: ['ie', 'ie9', 'win']
                    }, {
                        browserName: 'internet explorer',
                        version: '8',
                        platform: 'Windows XP',
                        tags: ['ie', 'ie8', 'win']
                    }, {
                        browserName: 'internet explorer',
                        version: '7',
                        platform: 'Windows XP',
                        tags: ['ie', 'ie7', 'win']
                    }, {
                        browserName: 'internet explorer',
                        version: '6',
                        platform: 'Windows XP',
                        tags: ['ie', 'ie6', 'win']
                    }, {
                        browserName: 'firefox',
                        tags: ['firefox', 'win']
                    }, {
                        browserName: 'firefox',
                        platform: 'OS X 10.6', // todo: update to 10.9 once saucelabs supports it
                        tags: ['firefox', 'mac']
                    }, {
                        browserName: 'chrome',
                        tags: ['chrome', 'win']
                    }, {
                        browserName: 'chrome',
                        platform: 'OS X 10.9',
                        tags: ['chrome', 'mac']
                    }, {
                        browserName: 'safari',
                        version: 5,
                        platform: 'OS X 10.6',
                        tags: ['safari', 'mac']
                    }, {
                        browserName: 'safari',
                        version: 6,
                        platform: 'OS X 10.8', // todo: update to 10.9 once saucelabs supports it
                        tags: ['safari', 'mac']
                    }, {
                        browserName: 'opera',
                        tags: ['opera']
                    }]
                }
            }
        }
    });

    grunt.registerTask('test', ['connect:test', 'saucelabs-jasmine']);

};
