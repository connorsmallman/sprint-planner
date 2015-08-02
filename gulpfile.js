var gulp = require("gulp");
var babel = require("gulp-babel");
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');

gulp.task('bundle', function() {
    browserify({
        entries: './app/app.js',
        debug: true
    })
    .transform(hbsfy)
    .transform(babelify)
    .bundle()
    .pipe(source('sprint-planner-min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("watch", function(){
    gulp.watch('./app/**/*.js', ['default'])
});

gulp.task('default', ['bundle','watch']);