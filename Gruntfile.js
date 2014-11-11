/*jshint node: true, browser: false*/
"use strict";
module.exports = function(grunt) {
    var _ = require('lodash');

    function browserVersions(browser, min, max) {
        return _.map(_.range(min, max), function(v) {
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
    grunt.loadNpmTasks('grunt-exec');
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
                    urls: ['http://127.0.0.1:8000/tests/SpecRunner.html'],
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3, //'Number of concurrent browsers to test against. Will default to the number of overall browsers specified. Check your plan (free: 2, OSS: 3) and make sure you have got sufficient Sauce Labs concurrency.',
                    detailedError: true, //'false (default) / true; if true log detailed test results when a test error occurs',
                    testname: 'SwfStore',
                    sauceConfig: {
                        // https://docs.saucelabs.com/reference/test-configuration/
                        'video-upload-on-pass': false,
                        'idle-timeout': 61 // (seconds), per test
                    },
                    "max-duration": 60, // seconds per js test
                    // https://saucelabs.com/platforms
                    browsers: browserVersions('internet explorer', 6, 11)
                        .concat(browserVersions('safari', 5, 8))
                        .concat(browserPlatforms(['chrome', 'firefox'], ['OS X 10.10', 'Windows 8.1', 'linux']))
                        .concat([{
                            browserName: 'opera'
                        }])

                    /*[{
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
                        platform: 'Windows 7'
                    }, {
                        browserName: 'internet explorer',
                        version: '7',
                        platform: 'Windows 7'
                    }, {
                        browserName: 'internet explorer',
                        version: '6',
                        platform: 'Windows XP'
                    }, {
                        browserName: 'firefox',
                        platform: 'Windows 8.1'
                    }, {
                        browserName: 'firefox',
                        platform: 'OS X 10.10'
                    }, {
                        browserName: 'chrome',
                        platform: 'Windows 8.1'
                    }, {
                        browserName: 'chrome',
                        platform: 'OS X 10.10'
                    }, {
                        browserName: 'safari',
                        version: 8,
                        platform: 'OS X 10.10'
                    }, {
                        browserName: 'safari',
                        version: 7,
                        platform: 'OS X 10.9'
                    }]*/
                }
            }
        }
    });

    // todo: extract this to it's own node.js module
    grunt.task.registerMultiTask('swf', 'based on grunt-exec but tweaked so that I can specify the source and destination paths for grunt-newer', function() {
        var log = grunt.log;
        var verbose = grunt.verbose;

        var opts = this.options();
        var files = this.files;

        var sdkPath = opts['flex-sdk-path'];
        if (!sdkPath) {
            throw new Error("Flex SDK path is required, see readme for details.");
        }
        var done = this.async();
        var fs = require('fs');
        var pathUtil = require('path');
        var mxmlcPath = pathUtil.resolve(__dirname, sdkPath, './bin/mxmlc');
        if (process.platform == 'win32') {
            // node does not appear to have a seperate flag for 64-bit windows: http://nodejs.org/api/process.html#process_process_platform
            mxmlcPath += ".bat";
        }
        console.log('checking', mxmlcPath);
        fs.exists(mxmlcPath, function(exists) {
            if (!exists) {
                return done(new Error("mxmlc (Flex SDK's swf compiler) not found at path " + mxmlcPath));
            }
            console.log('mxmlc found');
            var cp = require('child_process');

            function exec(bin, args, done) {
                var command = cp.spawn(bin, args, {
                    cwd: __dirname
                });

                command.stdout.on('data', function(d) {
                    log.write(d);
                });
                command.stderr.on('data', function(d) {
                    log.error(d);
                });

                // Catches failing to execute the command at all (eg spawn ENOENT),
                // since in that case an 'exit' event will not be emitted.
                command.on('error', function(err) {
                    log.error('Failed with: ' + err);
                    done(false);
                });

                command.on('close', function(code) {
                    if (code) {
                        log.error('Exited with code: ' + code);
                        return done(false);
                    }
                    verbose.ok('Exited with code: ' + code);
                    done();
                });
            }

            files.forEach(function(file) {
                if (file.src.length > 1) {
                    throw new Error("grunt-swf: only one src file at a time, please: " + files.src.join(', '));
                }
                var src = file.src[0];
                var dest = file.dest;

                exec(mxmlcPath, [src], function(err) {
                    if (err) {
                        return err;
                    }
                    exec('mv', [src.replace('.as', '.swf'), dest], done);
                });
            });
        });
    });


    grunt.registerTask('test', ['jshint', 'jsbeautifier:verify', 'connect:test', 'saucelabs-jasmine']);
    grunt.registerTask('build', ['newer:uglify', 'newer:swf']);
    grunt.registerTask('force-build', ['uglify', 'swf']);
    grunt.registerTask('beautify', ['jsbeautifier:rewrite']);
    grunt.registerTask('pre-commit', ['jshint', 'jsbeautifier:verify', 'build']);

};
