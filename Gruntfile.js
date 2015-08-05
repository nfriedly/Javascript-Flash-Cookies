/*jshint node: true, browser: false*/
"use strict";

module.exports = function(grunt) {
    var _ = require('lodash');

    function browserVersions(browser, min, max) {
        return _.map(_.range(min, max + 1), function(v) {
            return {
                browserName: browser,
                version: v
            };
        });
    }

    function browserPlatforms(browsers, platforms) {
        return _.flatten(_.map(browsers, function(browser) {
            return _.map(platforms, function(p) {
                return {
                    browserName: browser,
                    platform: p
                };
            });
        }));

    }

    var scripts = ["*.js", "src/*.js", "tests/spec/*.js"];

    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-swf');

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
                    urls: ['http://127.0.0.1:8000/tests/spec-runner.html'],
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3, //'Number of concurrent browsers to test against. Will default to the number of overall browsers specified. Check your plan (free: 2, OSS: 3) and make sure you have got sufficient Sauce Labs concurrency.',
                    detailedError: true, //'false (default) / true; if true log detailed test results when a test error occurs',
                    testname: 'SwfStore',
                    sauceConfig: {
                        // https://docs.saucelabs.com/reference/test-configuration/
                        'video-upload-on-pass': false
                    },
                    tunnelArgs: ['--verbose'],
                    // https://saucelabs.com/platforms
                    browsers: browserVersions('internet explorer', 8, 11) // browser, start version, end version. Library actually works in IE 6 & 7 but the tests do not
                        .concat(browserVersions('safari', 7, 8))
                        .concat({
                            browserName: 'safari',
                            version: 8.1
                        })
                        // there's a bug with running the chrome tests on sauce labs
                        // for some reason, the test result is requested *immediately*, before the tests have executed
                        .concat(browserPlatforms(['chrome', 'firefox'], ['OS X 10.10', 'Windows 8.1', 'linux']))
                        .concat([{
                            browserName: 'opera'
                        }])
                }
            }
        }
    });



    grunt.registerTask('serve', ['connect:serve']);
    grunt.registerTask('quick-test', ['jshint', 'jsbeautifier:verify']);
    grunt.registerTask('test', ['jshint', 'jsbeautifier:verify', 'connect:test', 'saucelabs-jasmine']);
    grunt.registerTask('build', ['newer:uglify', 'newer:swf']);
    grunt.registerTask('force-build', ['uglify', 'swf']);
    grunt.registerTask('beautify', ['jsbeautifier:rewrite']);
    grunt.registerTask('pre-commit', ['quick-test', 'build']);

    grunt.registerTask('default', ['beautify', 'build', 'test']);

};
