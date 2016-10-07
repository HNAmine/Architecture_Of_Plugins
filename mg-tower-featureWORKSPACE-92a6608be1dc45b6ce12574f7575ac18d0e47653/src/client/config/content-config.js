var join = require('path').join;

export var r = {
  "appContent": [{
    "title": "Features for template-ui",
    "icon": "template-ui",
    "childs": [{
      "name": "Examples",
      "displayName": "Examples",
      "entryPoint": {
        "path": "/example",
        "as": "Examples",
        "component": "AppComponent",
        "package_path": "./components/app.js"
      },
      "homePage": "./Examples"
    }]
  }],
  "sharedPackages": ["magnuscli-shared"],
  "endPoints": [{
    "endPoint": "login.api",
    "url": "http://identity.magnus-ci.duckdns.org"
  }, {
    "endPoint": "config.api",
    "url": "http://localhost:3000"
  }],
  "systemjsConfig": {
    "baseURL": join(__dirname),
    "map": {
      "rxjs": "rxjs"
    },
    "bundles": {
      "magnus-front": ["magnus-front/inputs.js", "magnus-front/new-inputs.js", "magnus-front/shared.js", "magnus-front/directives.js", "magnus-front/components.js", "magnus-front/services.js"],

      "bundleLib": ["immutable.js", "lodash.js", "moment.js", "@angular/*.js", "@angular2-material/*.js",
        "primeng/primeng"
      ]
    },
    "paths": {
      "magnus-front":  "lib/magnus-front.js",
      "tower-base-client":  "lib/tower-base-client.js",
      "magnus-app":  "lib/magnus-app.js",
      "magnus-metadata":  "lib/magnus-metadata.js",
      "bundleLib":  "lib/libs-ng2-bundle.js",
      "socket.io-client":  "lib/socket.io.js",
      "magnuscli-shared":  "app/magnuscli-shared.js",
      "mg-git-plugin":  "plugins/mg-git-plugin.js",
      "mg-npm-plugin":  "plugins/mg-npm-plugin.js",
      "mg-exe-plugin":  "plugins/mg-exe-plugin.js",
      "mg-msii-plugin":  "plugins/mg-msii-plugin.js"
    },
    "defaultJSExtensions": true
  }
}
