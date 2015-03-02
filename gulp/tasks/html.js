var config      = require('../config'),
    path        = require('path'),
    gutil       = require('gulp-util'),
    gulp        = require('gulp'),
    connect     = require('gulp-connect'),
    inject      = require("gulp-inject");


gulp.task('html', ['css', 'concat'], function(){

    gulp.src(path.join(config.SRC,'index.html'))
        .pipe(inject(gulp.src(path.join(config.DIST,'vendors','jquery.min.js'), {read: false}), {
            name: 'jquery',
            relative: false,
            ignorePath: 'dist',
            addRootSlash: false
        }))
        .pipe(inject(gulp.src(path.join(config.DIST,'vendors','modernizr.min.js'), {read: false}), {
            name: 'modernizr',
            relative: false,
            ignorePath: 'dist',
            addRootSlash: false
        }))
        .pipe(inject(gulp.src(path.join(config.DIST_CSS, 'font-awesome.min.css'), {read: false}), {
            name: 'fontawesome',
            relative: false,
            ignorePath: 'dist',
            addRootSlash: false
        }))
        .pipe(inject(gulp.src(path.join(config.DIST_CSS, 'main.css'), {read: false}), {
            name: 'main',
            relative: false,
            ignorePath: 'dist',
            addRootSlash: false
        }))
        .pipe(inject(gulp.src(path.join(config.DIST,'vendors', 'vendors.min.js'), {read: false}), {
            name: 'vendors',
            relative: false,
            ignorePath: 'dist',
            addRootSlash: false
        }))
        .pipe(inject(gulp.src([path.join(config.DIST,'application', 'application.js'),path.join(config.DIST,'components', 'components.js')], {read: false}), {
            name: 'application',
            relative: false,
            ignorePath: 'dist',
            addRootSlash: false
        }))
    .pipe(connect.reload())
    .pipe(gulp.dest(config.DIST));
});
