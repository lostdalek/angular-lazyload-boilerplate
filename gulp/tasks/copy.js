var config      = require('../config'),
    path        = require('path'),
    gutil       = require('gulp-util'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    gulp        = require('gulp');

gulp.task('copy', function() {
    gulp.src([path.join(config.SRC, 'bower_components', 'modernizr', 'modernizr.js')]) //{ttf,woff,eof,svg}
        .pipe(uglify())
        .pipe(rename({basename: 'modernizr.min'}))
        .pipe(gulp.dest(path.join(config.DIST, 'vendors')));

    gulp.src([path.join(config.SRC, 'bower_components', 'jquery','dist', 'jquery.min.js')]) //{ttf,woff,eof,svg}
        .pipe(gulp.dest(path.join(config.DIST, 'vendors')));

    gulp.src([path.join(config.SRC, 'images', "**", "*.*")]) //{ttf,woff,eof,svg}
        .pipe(gulp.dest(path.join(config.DIST, 'images')));

    gulp.src([path.join(config.SRC, 'fonts', "**", "*.*")]) //{ttf,woff,eof,svg}
        .pipe(gulp.dest(path.join(config.DIST, 'fonts')));


    // copy fonawesome
    gulp.src([path.join(config.SRC, 'bower_components', 'font-awesome','css', 'font-awesome.min.css')]) //{ttf,woff,eof,svg}
        .pipe(gulp.dest(path.join(config.DIST, 'css')));

    gulp.src([path.join(config.SRC, 'bower_components', 'font-awesome','fonts', '*.*')]) //{ttf,woff,eof,svg}
        .pipe(gulp.dest(path.join(config.DIST, 'fonts')));

    // copy angular lib:
});
