/*jshint node: true, browser: false*/
"use strict";
module.exports = function(grunt) {


    var scripts = ["*.js", "src/*.js", "tests/spec/*.js"];

    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Project configuration.
    grunt.initConfig({

        uglify: {
            options: {
                mangle: false
            },
            swfstore: {
                files: {
                    'dist/swfstore.min.js': ['src/swfstore.js']
                }
            }
        },

        "jsbeautifier": {
            "rewrite": {
                src: scripts
            },
            "verify": {
                src: scripts,
                options: {
                    mode: "VERIFY_ONLY"
                }
            }
        },

        "jshint": {
            options: {
                jshintrc: true
            },
            scripts: scripts
        },


        exec: {
            build: __dirname + "/flex-sdk/bin/mxmlc src/Storage.as && mv src/Storage.swf ./dist/storage.swf"
        },

        //flex-sdk/bin/mxmlc src/Storage.as && mv

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
                    sauceConfig: {
                        // https://docs.saucelabs.com/reference/test-configuration/
                        'video-upload-on-pass': false,
                        'idle-timeout': 30 // (seconds), per test
                    },
                    // https://saucelabs.com/platforms
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
                        platform: 'Windows 7',
                        tags: ['ie', 'ie8', 'win']
                    }, {
                        browserName: 'internet explorer',
                        version: '7',
                        platform: 'Windows 7',
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
                        platform: 'OS X 10.10',
                        tags: ['firefox', 'mac']
                    }, {
                        browserName: 'chrome',
                        tags: ['chrome', 'win']
                    }, {
                        browserName: 'chrome',
                        platform: 'OS X 10.10',
                        tags: ['chrome', 'mac']
                    }, {
                        browserName: 'safari',
                        version: 8,
                        platform: 'OS X 10.10',
                        tags: ['safari', 'mac']
                    }, {
                        browserName: 'safari',
                        version: 7,
                        platform: 'OS X 10.9',
                        tags: ['safari', 'mac']
                    }, {
                        browserName: 'opera',
                        tags: ['opera']
                    }]
                }
            }
        }
    });

    grunt.registerTask('test', ['jshint', 'jsbeautifier:verify', 'connect:test', 'saucelabs-jasmine']);
    grunt.registerTask('build', ['uglify', 'exec:build']);
    grunt.registerTask('beautify', ['jsbeautifier:rewrite']);

};
