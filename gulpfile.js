/**
 * Created by leon on 16/4/16.
 */
  
var gulp = require('gulp');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
const filter = require('gulp-filter');

gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concatCss("styles/bundle.css"))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/**/*.scss', ['sass']);
});

gulp.task('bundlejs', function () {
  return gulp.src('./src/**/*.js')
    .pipe(concat("js/bundle.js"))
    .pipe(gulp.dest('./dist'));
});

gulp.task('vendor', function () {
  const jsFilter = filter('**/*.js', {restore: true});
  const cssFilter = filter('**/*.css', {restore: true});

  return gulp.src(bowerFiles())
    .pipe(jsFilter)
    .pipe(concat("js/vendor.js"))
    .pipe(gulp.dest('./dist'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(concat("styles/vendor.css"))
    .pipe(gulp.dest('./dist'));
});

gulp.task('index', ['bundlejs', 'vendor'], function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./dist/**/*.js', './dist/**/*.css'], {read: false});

  return target.pipe(inject(sources /*, {addPrefix:'static'}*/))
    .pipe(gulp.dest('./dist'));
});

