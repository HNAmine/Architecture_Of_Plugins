let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);
let nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');


class RollupNG2 {
    constructor(options) {
        this.options = options;
    }
    resolveId(id, from) {
        if (id.startsWith('rxjs/')) {
            return `${__dirname}/node_modules/rxjs-es/${id.replace('rxjs/', '')}.js`;
        }
    }
}

const rollupNG2 = (config) => new RollupNG2(config);


module.exports = {
    entry: 'built/es6/src/services.js',
    external: external,
    dest: 'umd/magnus-front.umd.js',
    format: 'umd',
    moduleName: 'magnus-front',
    sourceMap: true,
    plugins: [
            rollupNG2(),
            nodeResolve({
                jsnext: true
            }),
            // commonjs(),
            // env.min ? uglify() : {} // think about it

        ]
        // This is how you exclude code from the bundle
        ,
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/router-deprecated'

    ],
    // This is how you link the referenced module ids to the
    // global variables exposed by the vendor bundle.
    globals: {
        '@angular/core': 'vendor._angular_core',
        '@angular/http': 'vendor._angular_http',
        '@angular/platform-browser-dynamic': 'vendor._angular_platformBrowserDynamic',
        '@angular/router-deprecated': 'vendor._angular_routerDeprecated',
        'moment': 'moment'
    }
};
