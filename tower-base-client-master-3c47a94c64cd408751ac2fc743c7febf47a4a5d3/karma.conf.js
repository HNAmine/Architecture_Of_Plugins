// Karma configuration
// Generated on Wed Jul 15 2015 09:44:02 GMT+0200 (Romance Daylight Time)
'use strict';

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // Polyfills.
            'node_modules/es6-shim/es6-shim.js',

            'node_modules/reflect-metadata/Reflect.js',

            // System.js for module loading
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',

            // Zone.js dependencies
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            "node_modules/lodash/lodash.js",
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/magnus-metadata/bundle/magnus-metadata.js',
            "node_modules/moment/moment.js",
            "node_modules/immutable/dist/immutable.js",
            "node_modules/socket.io-client/socket.io.js",
            // RxJs.
            {
                pattern: 'node_modules/rxjs/**/*.js',
                included: false,
                watched: false
            }, {
                pattern: 'node_modules/angular2-jwt/angular2-jwt.js',
                included: false,
                watched: false
            }, {
                pattern: 'node_modules/rxjs/**/*.js.map',
                included: false,
                watched: false
            },

            // paths loaded via module imports
            // Angular itself
            {
                pattern: 'node_modules/@angular/**/*.js',
                included: false,
                watched: true
            },


            // {
            //     pattern: 'built/es5/test/**/*.js',
            //     included: false,
            //     watched: true
            // },
            {
                pattern: 'built/es5/src/**/*.js',
                included: false,
                watched: true
            }, {
                pattern: 'node_modules/systemjs/dist/system-polyfills.js',
                included: false,
                watched: false
            },
            'test-main.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'built/es5/src/**/!(*spec)!(*-utils).js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],


        coverageReporter: {
            dir: 'coverage-temp/',
            reporters: [{
                type: 'text-summary'
            }, {
                type: 'json',
                subdir: '.',
                file: 'coverage-final.json'
            }, {
                type: 'html'
            }]
        },



        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            // 'PhantomJS2',
            'Chrome'
        ],


        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        autoWatchBatchDelay : 2000,


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });

};
