/*jshint esversion: 6 */

var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

var Promise = require('es6-promise').Promise; // require for autoprefixer

//Cleans up dist folder
gulp.task('clean:dist', function() {
  return del.sync(['dist/**']);
});

//Sass - convert .scss / .sass files to .css
gulp.task('sass', function () {
  return gulp.src(['**/*.scss','!node_modules/**'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream:true
    }));
});
//Watch Sass
gulp.task('sass:watch', function () {
  gulp.watch('**/*.scss', ['sass']);
});

//Autoprefixer - applies vendor pre-fixes
gulp.task('autoprefix',function(){
    gulp.src('dist/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'));
});

//Browser-Sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'pomo'
    },
  });
});


///////////////////// runs

//watch
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('tobychow/**/*.scss', ['sass']); 
  // Other watchers
});


// cleans dist folder, convert to .css, add prefixes (in this order)
gulp.task('default', function (callback) {
  runSequence( 'clean:dist', 'sass', 'autoprefix',
    callback
  );
});

 

