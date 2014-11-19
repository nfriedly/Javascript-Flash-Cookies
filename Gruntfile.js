/*jshint node: true, browser: false*/
"use strict";
module.exports = function(grunt) {

    var scripts = ["*.js", "src/*.js", "tests/spec/*.js"];

    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-newer');

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

        swf: {
            options: {
                "flex-sdk-path": './flex-sdk'
            },
            'dist/storage.swf': 'src/Storage.as'
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
                    urls: ['http://127.0.0.1:8000/tests/spec-runner.html'],
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3, //'Number of concurrent browsers to test against. Will default to the number of overall browsers specified. Check your plan (free: 2, OSS: 3) and make sure you have got sufficient Sauce Labs concurrency.',
                    detailedError: true, //'false (default) / true; if true log detailed test results when a test error occurs',
                    testname: 'SwfStore',
                    identifier: 'grunt-tunnel',
                    //pollInterval: 5000,
                    tunnelArgs: ['--verbose'],
                    sauceConfig: {
                        // https://docs.saucelabs.com/reference/test-configuration/
                        'video-upload-on-pass': false
                    },
                    // https://saucelabs.com/platforms
                    browsers: [{
                        browserName: 'chrome',
                        platform: 'Windows 8.1'
                    }, {
                        browserName: 'chrome',
                        platform: 'OS X 10.10'
                    }, {
                        browserName: 'chrome',
                        platform: 'linux'
                    }]
                }
            }
        }
    });



    grunt.registerTask('serve', ['connect:serve']);
    grunt.registerTask('quick-test', ['jshint']);
    grunt.registerTask('test', ['jshint', 'connect:test', 'saucelabs-jasmine']);
    grunt.registerTask('build', ['newer:uglify', 'newer:swf']);
    grunt.registerTask('force-build', ['uglify', 'swf']);
    grunt.registerTask('beautify', ['jsbeautifier:rewrite']);
    grunt.registerTask('pre-commit', ['quick-test', 'build']);

};
