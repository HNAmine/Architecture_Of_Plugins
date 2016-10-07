var gulp = require("gulp");
var fs = require("fs");
var jasmine = require('gulp-jasmine');
var SpecReporter = require('jasmine-spec-reporter');
var runSequence = require('run-sequence');
var del = require('del');
var plumber = require('gulp-plumber');
var ts = require('gulp-typescript');
var shell = require('gulp-shell');
var template = require('gulp-template');
var conventionalChangelog = require('gulp-conventional-changelog');
var gutil = require('gulp-util');
var git = require('gulp-git');
var join = require('path').join;
var inject = require('gulp-inject');
var bump = require('gulp-bump');
var inlineNg2Template = require('gulp-inline-ng2-template');
var dir = require('./tasks/desktop');

gulp.task('tdd', function() {
  gulp.src('./config.json').pipe(gulp.dest('./built/es5'));
  gulp.src('built/es5/test' + '/**/*.js')
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: true,
      reporter: new SpecReporter()
    }));
});
gulp.task('clean', function(cb) {
  var dist = []
  dist.push('built/es5/**');
  dist.push('built/package/**/*.js');
  dist.push('built/package/docs/**');
  dist.push('built/package/**/*.d.ts');
  dist.push('!built/package/node_modules');
  dist.push('!built/package/node_modules/**');
  return del(dist, cb);
});
var spawn = require('child_process').spawn;
var assetsBuilder = require('mg-assets-layout')(gulp, {
  type: "md",
  dest: __dirname + "/built/package/client",
  themeName: "blue"
})
var release = require('mg-release');
release.register(gulp);

var src = {
  loader: [
    'node_modules/systemjs/dist/system-polyfills.src.js',
    "node_modules/zone.js/dist/zone.js",
    "node_modules/reflect-metadata/Reflect.js",
    "node_modules/es6-shim/es6-shim.js",
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/whatwg-fetch/fetch.js',
    "node_modules/socket.io-client/socket.io.js",
    'node_modules/magnus-vendor-lib/bundle/libs-ng2-bundle.js'
  ],
  magnus_cli: [
    "node_modules/magnuscli-shared/bundle/magnuscli-shared.js"
  ],
  magnus_libs: [
    "node_modules/magnus-app/bundle/magnus-app.js",
    "node_modules/magnus-front/bundle/magnus-front.js",
    "node_modules/magnus-metadata/bundle/magnus-metadata.js",
    "node_modules/tower-base-client/bundle/tower-base-client.js"
  ],
  plugins_libs: [
    "node_modules/mg-git-plugin/bundle/mg-git-plugin.js",
    "node_modules/mg-npm-plugin/bundle/mg-npm-plugin.js",
    "node_modules/mg-exe-plugin/bundle/mg-exe-plugin.js",
    "node_modules/mg-msii-plugin/bundle/mg-msii-plugin.js"
  ],
  publicDir: 'public/**',
  app: 'app'
}

src.lib = src.loader.concat(src.magnus_libs);

templateLocals = function() {
  return {
    VERSION: getVersion(),
    APP_BASE: "/"
  };
}

injectableDevAssetsRef = function() {
  var src2 = src.lib.map(function(path) {
    return join("built/package/client/lib", path.split('/')
      .pop());
  });
  src2 = src2.concat(assetsBuilder.listAssets.map(function(path) {
    return join("built/package/client", path);
  }))
  console.log(src2)
  return src2.concat('built/package/client/init.js');
}

getVersion = function() {
  var pkg = JSON.parse(fs.readFileSync('package.json'));
  return pkg.version;
}

transformPath = function(env) {
  var v = '?v=' + getVersion();
  return function(filepath) {
    var filename = filepath.replace("built/package/client/", '') + v;
    // arguments[0] = join('./', filename);
    arguments[0] = '.' + filename;
    return inject.transform.apply(inject.transform, arguments);
  };
}

gulp.task('build.index.dev', function() {
  var target = gulp.src(injectableDevAssetsRef(), {
    read: false
  });
  return gulp.src('built/package/client/index.html')
    .pipe(inject(target, {
      transform: transformPath('dev')
    }))
    .pipe(template(templateLocals()))
    .pipe(gulp.dest("built/package/client"));
});

gulp.task('build.lib.dev', function() {
  return gulp.src(src.lib)
    .pipe(gulp.dest("built/package/client/lib/"));
});

gulp.task('build.app.dev', function() {
  return gulp.src(src.magnus_cli, {
      follow: true
    })
    .pipe(gulp.dest("built/package/client/app/"));
});

gulp.task('copie.plugins.dev', function() {
  return gulp.src(src.plugins_libs, {
      follow: true
    })
    .pipe(gulp.dest("built/package/client/plugins/"));
});

gulp.task('build.lib.rxjs', function() {
  return gulp.src('./node_modules/rxjs/**/*.js')
    .pipe(gulp.dest("built/package/client/rxjs/"));
});

gulp.task('clean', function(cb) {
  return del(['./built/**'], cb);
});

gulp.task('build-package-copy-config', function() {
  return gulp.src(['src/client/config/**'])
    .pipe(gulp.dest('built/package/client/config'));
});

gulp.task('copy.assets', function() {
  return gulp.src('node_modules/mg-assets-layout/**')
    .pipe(gulp.dest("built/package/client"));
});

gulp.task('build.desktop', function(cb) {
  return runSequence(
    'build-package-copy-config.desktop','build.lib.dev.desktop','build.lib.rxjs.desktop',  'build.app.dev.desktop', 'copie.plugins.dev.desktop', 'copy.assets.desktop',  'compile-client.desktop','test.desktop', 'build.index.dev.desktop',
    cb
  );
});

gulp.task('package', function(cb) {
  return runSequence(
    'clean', 'build', ['build-package-copy-files',
      'build-package-config-files', "build-package-copy-config",
      "build.layout", 'build.lib.dev', 'build.lib.rxjs', 'copie.plugins.dev'
    ], 'build.index.dev',
    cb
  );
});

gulp.task('compile-client', function() {
  var tsProject = ts.createProject('tsconfig.json', {
    sortOutput: false,
    typescript: require('typescript')
  });
  return gulp.src([
      "typings/index.d.ts",
      "src/client/**/*.ts"
    ])
    .pipe(plumber())
    .pipe(inlineNg2Template({
      base: '/src/client',
      removeLineBreaks: true,
      html: true,
      css: true,
      quote: "'",
      target: 'es5',
      useRelativePaths: true,
      supportNonExistentFiles: true
    }))
    .pipe(ts({
      "target": "es5",
      "module": "commonjs",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "sourceMap": true,
      "noImplicitAny": false,
      typescript: require('typescript')
    }))
    .js.pipe(gulp.dest('./built/package/client'));
});

gulp.task('compile-client.desktop', function() {
  var tsProject = ts.createProject('tsconfig.json', {
    sortOutput: false,
    typescript: require('typescript')
  });
  return gulp.src([
      "typings/index.d.ts",
      "src/client/**/*.ts"
    ])
    .pipe(plumber())
    .pipe(inlineNg2Template({
      base: '/src/client',
      removeLineBreaks: true,
      html: true,
      css: true,
      quote: "'",
      target: 'es5',
      useRelativePaths: true,
      supportNonExistentFiles: true
    }))
    .pipe(ts({
      "target": "es5",
      "module": "commonjs",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "sourceMap": true,
      "noImplicitAny": false,
      typescript: require('typescript')
    }))
    .js.pipe(gulp.dest('./built/package/desktop'));
});

gulp.task('compile-server', function() {
  var tsProject = ts.createProject('tsconfig.json', {
    sortOutput: false,
    typescript: require('typescript')
  });
  return gulp.src(["typings/index.d.ts",
      "!node_modules/angular2/**/*.d.ts",
      "node_modules/immutable/dist/immutable.d.ts",
      "node_modules/controllers.ts/index.d.ts",
      "./node_modules/immutable/dist/immutable.d.ts",
      "src/server/**/*.ts"
    ])
    .pipe(ts({
      "target": "es5",
      "module": "commonjs",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "sourceMap": true,
      "noImplicitAny": false,
      typescript: require('typescript')
    }))
    .js.pipe(gulp.dest('built/package/server'));
});

gulp.task('build-package-copy-src', function() {
  return gulp.src('./built/es5/src/**/*')
    .pipe(gulp.dest('./built/package'));
});

gulp.task('build-package-copy-files', function() {
  return gulp.src(['./package.json', './README.md'])
    .pipe(gulp.dest('./built/package'));
});

gulp.task('build-package-config-files', function() {
  return gulp.src(['./config.json', './config-apps.json'])
    .pipe(gulp.dest('./built/package/server'));
});

gulp.task('build', function(cb) {
  return runSequence(
    'compile-server', 'compile-client', 'build.app.dev',
    cb
  );
});

gulp.task('package', function(cb) {
  return runSequence(
    'clean', 'build', ['build-package-copy-files',
      'build-package-config-files', "build-package-copy-config",
      "build.layout", 'build.lib.dev', 'build.lib.rxjs', 'copie.plugins.dev'
    ], 'build.index.dev','build.desktop',
    cb
  );
});

gulp.task('watch.dev', function() {
  gulp.watch(['node_modules/magnus-app/bundle/*.js'], [
    'build.lib.dev'
  ]);
  gulp.watch(['node_modules/magnus-front/bundle/*.js'], [
    'build.lib.dev'
  ]);
  gulp.watch(['node_modules/magnus-metadata/bundle/*.js'], [
    'build.lib.dev'
  ]);
  gulp.watch(['node_modules/magnuscli-shared/bundle/*.js'], [
    'build.app.dev'
  ]);
  gulp.watch(['node_modules/magnuscli-ui/bundle/*.js'], [
    'build.app.dev'
  ]);
});

gulp.task('develop', ['package', 'watch.dev'], function() {
  gulp.watch(['src/server/**/*.ts'], ['compile-server']);
  gulp.watch(['src/client/**/*.ts'], ['compile-client']);
});

gulp.task('default', ['build']);
