var gulp   = require('gulp'),
    watch      = require('gulp-watch'),
    babelify   = require('babelify'),
    gbrowserify = require('gulp-browserify');


gulp.task('buildapp', function (cb) {
    gulp.src('./src/js/*.js')
        .pipe(gbrowserify({
            transform: ['babelify'],
        }))
        .pipe(gulp.dest('dist/js/'))
        .on('end', function() { console.log('transpile succeed.'); cb();})
});

gulp.task('watchapp', function() {
    gulp.watch(['./src/js/*.js', './src/js/*/*.js'], ['buildapp']);
});