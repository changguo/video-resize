var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require("gulp-babel");

gulp.task('default', function() {
  gulp.watch(['video-resize.js'], ['build'])
});

gulp.task('build', function() {
  return gulp.src('video-resize.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('video-resize.min.js'))
    .pipe(gulp.dest(''))
});
