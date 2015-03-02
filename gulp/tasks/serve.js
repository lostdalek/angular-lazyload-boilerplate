var config      = require('../config'),
    path        = require('path'),
    gulp        = require('gulp'),
    server     = require('gulp-express'),
    nodemon = require('gulp-nodemon'),
    gutil       = require('gulp-util'),
    historyApiFallback = require('connect-history-api-fallback');

/**
 * Start an http server at localhost:3001
 */

gulp.task('serve', ['build', 'watch'], function () {
    nodemon({ script: './api-server/src/app.js', ext: 'html js', ignore: ['gulp', 'node_module', 'src', 'dist'] })
        .on('change', ['lint'])
        .on('restart', function () {
            console.log('restarted!')
        });
});
