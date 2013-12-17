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
                    username: 'jsfc', // if not provided it'll default to ENV SAUCE_USERNAME
                    key: '53b0264d-afb9-449c-8dfc-94eff9593511', // if not provided it'll default to ENV SAUCE_ACCESS_KEY
                    urls: ['http://localhost:8000/tests/SpecRunner.html'],
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3, //'Number of concurrent browsers to test against. Will default to the number of overall browsers specified. Check your plan (free: 2, OSS: 3) and make sure you have got sufficient Sauce Labs concurrency.',
                    detailedError: true, //'false (default) / true; if true log detailed test results when a test error occurs',
                    testname: 'SwfStore',
                    browsers: [
                        {
                            browserName: 'internet explorer',
                            version: '11',
                            platform: 'Windows 8.1',
                            tags: ['ie', 'ie11']
                        }, {
                            browserName: 'internet explorer',
                            version: '10',
                            platform: 'Windows 8',
                            tags: ['ie', 'ie10']
                        }, {
                            browserName: 'internet explorer',
                            version: '9',
                            platform: 'Windows 7',
                            tags: ['ie', 'ie9']
                        }, {
                            browserName: 'internet explorer',
                            version: '8',
                            platform: 'Windows XP',
                            tags: ['ie', 'ie8']
                        }, {
                            browserName: 'internet explorer',
                            version: '7',
                            platform: 'Windows XP',
                            tags: ['ie', 'ie7']
                        }, {
                            browserName: 'internet explorer',
                            version: '6',
                            platform: 'Windows XP',
                            tags: ['ie', 'ie6']
                        }, {
                            browserName: 'firefox',
                            tags: ['firefox']
                        }, {
                            browserName: 'chrome',
                            tags: ['chrome']
                        }, {
                            browserName: 'safari',
                            tags: ['safari']
                        }, {
                            browserName: 'opera',
                            tags: ['opera']
                        }
                    ]
                }
            }
        }
    });

    grunt.registerTask('test', ['saucelabs-jasmine'])

}