debugger;
if (!Object.hasOwnProperty('name')) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var matches = this.toString()
                .match(/^\s*function\s*(\S*)\s*\(/);
            var name = matches && matches.length > 1 ? matches[1] :
                "";
            Object.defineProperty(this, 'name', {
                value: name
            });
            return name;
        }
    });
}

// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};
System.config({
    baseURL: '/base/'
});
System.config({

    defaultJSExtensions: true,
    "map": {
        "rxjs": "node_modules/rxjs",
        "@angular": "node_modules/@angular",
        "angular2-jwt": "node_modules/angular2-jwt/angular2-jwt.js"
    },

    "packages": {
        "@angular/core": {
            "main": "index.js",
            "defaultExtension": "js"
        },
        "@angular/compiler": {
            "main": "index.js",
            "defaultExtension": "js"
        },
        "@angular/common": {
            "main": "index.js",
            "defaultExtension": "js"
        },

        "@angular/forms": {
            "main": "index.js",
            "defaultExtension": "js"
        },
        "@angular/http": {
            "main": "index.js",
            "defaultExtension": "js"
        },
        "@angular/platform-browser": {
            "main": "index.js",
            "defaultExtension": "js"
        },
        "@angular/platform-browser-dynamic": {
            "main": "index.js",
            "defaultExtension": "js"
        },
        "@angular/router-deprecated": {
            "main": "index.js",
            "defaultExtension": "js"
        },
        "@angular/upgrade": {
            "main": "index.js",
            "defaultExtension": "js"
        },

        'rxjs': {
            defaultExtension: 'js'
        }
    },
    paths: {
        "immutable": "node_modules/immutable/dist/immutable.js",
        "moment": "node_modules/moment/moment.js",
        "lodash": "node_modules/lodash/lodash.js",
        "magnus-metadata": "node_modules/magnus-metadata/bundle/magnus-metadata.js",
        "socket.io-client": "node_modules/socket.io-client/socket.io.js"
    }
});


Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')

    ])
    .then(function(modules) {
        var testing = modules[0];
        var browser = modules[1];
        testing.setBaseTestProviders(browser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
            browser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

    })
    .then(function() {
        return Promise.all(
            Object.keys(window.__karma__.files) // All files served by Karma.
            .filter(onlySpecFiles)
            .map(file2moduleName)
            .map(function(path) {
                return System.import(path)
                    .then(function(module) {
                        if (module.hasOwnProperty('main')) {
                            module.main();
                        } else {
                            throw new Error('Module ' + path +
                                ' does not implement main() method.'
                            );
                        }
                    });
            }));
    })
    .then(function() {
        __karma__.start();
    }, function(error) {
        console.error(error.stack || error);
        __karma__.start();
    });

function onlySpecFiles(path) {
    return /[\.|_]spec\.js$/.test(path);
}

// Normalize paths to module names.
function file2moduleName(filePath) {
    return filePath.replace(/\\/g, '/')
        .replace(/^\/base\//, '')
        .replace(/\.js/, '');
}
