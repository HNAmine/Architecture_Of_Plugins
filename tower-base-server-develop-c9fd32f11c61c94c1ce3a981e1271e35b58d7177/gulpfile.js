var gulp = require("gulp");
var fs = require("fs");

var jasmine = require('gulp-jasmine');
var SpecReporter = require('jasmine-spec-reporter');

var options = {

  testFilesToCompile: ["typings/index.d.ts",

    "test/**/*.ts"],

  filesToCompile: ["typings/index.d.ts",
    "src/**/*.ts"
  ],
  filesToCopy: ["./README.md", "./package.json", "./config.json" ,"./public/*"]
  // ,
  // testTask: 'tdd'
}

var mgTasks = require("mg-tasks")(gulp, options)

gulp.task('tdd', function() {
  gulp.src('./config.json')
    .pipe(gulp.dest('./built/es5'));

  gulp.src('built/es5/test' + '/**/*.js')
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: true,
      reporter: new SpecReporter()
    }));
});
