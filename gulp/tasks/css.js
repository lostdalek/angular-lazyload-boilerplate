var config      = require('../config'),
    path        = require('path'),
    gutil       = require('gulp-util'),
    gulp        = require('gulp'),
    flatten     = require('gulp-flatten'),
    gulpif      = require('gulp-if'),
    debug       = require('gulp-debug'),
    handleErrors = require('../util/handleErrors'),
    compass     = require('gulp-compass'),
    minifyCSS   = require('gulp-minify-css'),
    connect     = require('gulp-connect');



gulp.task('css', function(){

    var compassOpts = {

        css: path.join(config.TMP, 'css'),
        sass: config.SRC_SASS,
        //sourcemap: false,
        time: true,
        //debug: true,
        options: 'nested' //nested, expanded, compact, or compressed
    };

    if( config.env.compassOpts !== undefined ) {
        compassOpts = config.env.compassOpts;
    }

    return gulp.src([path.join(config.SRC_SASS,"**", "*.sass"), path.join(config.SRC_SASS,"**", "*.scss")] )
        .pipe(compass(compassOpts))
        .on('error', handleErrors)
        .pipe(gulpif(config.env.cssMinify, minifyCSS()))
        .pipe(flatten())
        .pipe(gulp.dest(path.join(config.DIST, 'css')));
});
