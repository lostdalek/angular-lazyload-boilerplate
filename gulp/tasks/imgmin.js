var config      = require('../config'),
    path        = require('path'),
    gutil       = require('gulp-util'),
    gulp        = require('gulp'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant');


// require app to be concat and css generated before bundling html
gulp.task('imgmin',  function() {
    return gulp.src(path.join(config.SRC,'images','*'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.join(config.SRC,'images')));
});
