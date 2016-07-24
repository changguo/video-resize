var gulp = require('gulp');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');

gulp.task('default', function() {
  gulp.watch(['video-resize.js'], ['build'])
  gulp.watch(['demo/src/scss/main.scss'], ['sass'])
});

gulp.task('build', function() {
  return gulp.src('video-resize.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('video-resize.min.js'))
    .pipe(gulp.dest(''))
});

gulp.task('sass', function() {
  return sass('demo/src/scss/main.scss', {
    style: 'compressed',
    noCache: true
  })
    .pipe(gulp.dest('demo/assets/css'))
});
