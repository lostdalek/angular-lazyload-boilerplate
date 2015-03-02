var config      = require('../config'),
    Dgeni       = require('dgeni'),
    gulp        = require('gulp');

gulp.task('dgeni', function() {
    var dgeni = new Dgeni([require('../../docs/dgeni-example')]);
    return dgeni.generate();
});
