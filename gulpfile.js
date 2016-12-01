/*jshint esversion: 6 */

// bash folder with gulp.js, and change path to desired folder
var path = './';

var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

var Promise = require('es6-promise').Promise.polyfill(); // require for autoprefixer



//Cleans up dist folder
gulp.task('clean:dist', function() {
  return del.sync(['dist/**']);
});

//Sass - convert .scss / .sass files to .css
gulp.task('sass', function () {
  // ignore node_modules folder
  return gulp.src([path+'*.scss','!node_modules/**'],{base: "."})
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('.'))
    .pipe(browserSync.reload({
      stream:true
    }));
});
//Watch Sass
gulp.task('sass:watch', function () {
  gulp.watch('*.scss', ['sass']);
});

//Autoprefixer - applies vendor pre-fixes
gulp.task('autoprefix',function(){
  // ignore node_modules folder
    gulp.src([path+'**/*.css','!node_modules/**'],{base:"."})
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('.'));
});

//Browser-Sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: path
    },
  });
});


///////////////////// Tasks to run /////////////////////

//watch, change browsersync baseDir, gulp.watch src, and Sass src to watch different project
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch(path+'*.scss', ['sass']); 
  gulp.watch(path+'*.html', browserSync.reload); 
  gulp.watch(path+'*.js', browserSync.reload);
 });


// cleans dist folder, convert to .css, add prefixes (in this order)
gulp.task('default', function (callback) {
  runSequence( 'clean:dist', 'sass', 'autoprefix',callback);
});

 

