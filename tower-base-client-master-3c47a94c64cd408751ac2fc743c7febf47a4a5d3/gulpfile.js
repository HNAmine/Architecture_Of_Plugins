var gulp = require("gulp");
var fs = require("fs");
var runSequence = require('run-sequence')
    .use(gulp);



var options = {
    filesToCompile: ["typings/index.d.ts",
        'src/**/*.ts'
    ],
    testFilesToCompile: [],
    filesToCopy: ["./README.md", "./package.json"],
    testTask: 'run-karma'
}

var mgTasks = require("mg-tasks")(gulp, options);


// gulp.task('bundle-rollup', function() {
//     var rollup = require('rollup').rollup;
//     let optionsRoolup = require(process.cwd() + '/rollup.config');
//     return rollup(optionsRoolup).then(function(bundle) {
//         return bundle.write({
//             format: 'umd',
//             dest: optionsRoolup.dest,
//             moduleName: optionsRoolup.moduleName,
//             globals: optionsRoolup.globals
//         });
//     });
// });
//
//
// gulp.task('karma-tdd-compile', ()=>{
//   gulp.watch(['src/**/*.ts'], ['compile'])
// })
//
// gulp.task('develop', ()=>{
//   gulp.watch(['src/**/*.ts'], ['tdd'])
// })
//
// gulp.task('tdd', (cb)=>{
//   runSequence('clean', 'compile','pre-test', 'run-karma','remap-istanbul','clean-coverage', cb)
// })
