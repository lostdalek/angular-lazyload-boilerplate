var gulp = require('gulp');
var _ = require('lodash');
var karma = require('karma').server;

//one could also externalize common config into a separate file,
//ex.: var karmaCommonConf = require('./karma-common-conf.js');
var karmaCommonConf = {
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
        'src/bower_components/angular/angular.js',
        'src/bower_components/angular-mocks/angular-mocks.js',
        'src/js/app.js',
        //'src/controller.js',
        'test/*.spec.js'
    ]
};
var karmaPhantomConf = {
    basePath: '.',
    frameworks: ['jasmine'],
    files: [
        'dist/vendors/vendors.min.js',
        'dist/application/application.js',
        //'src/bower_components/angular-mocks/angular-mocks.js',
        //'test/**.js'
    ],


    reporters: ['progress', 'coverage'],
    preprocessors: {
        'src/js/*.js': 'coverage'
    },

    coverageReporter: {
        reporters: [{
            type: 'html',
            dir: 'coverage/'
        }]
    },

    proxies: {
        '/local/': 'http://localhost:8080/'
    },

    autoWatch: false,
    singleRun: true,
    browsers: ['PhantomJS']
};


var karmaHalService= {
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
        'src/bower_components/angular/angular.js',
        'src/bower_components/angular-mocks/angular-mocks.js',
        'src/bower_components/rfc6570/rfc6570.js',
        'src/bower_components/angular-hal/angular-hal.js',
        'test/hal.js'
    ]
};

var karmaApplicationService= {
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
        'dist/vendors/jquery.min.js',
        'dist/vendors/modernizr.min.js',
        'dist/vendors/vendors.min.js',
        //'src/bower_components/angular/angular.js',
        'src/bower_components/angular-mocks/angular-mocks.js',
        //'dist/vendors/vendors.min.js',
        'dist/application/application.js',
        'test/application/*.spec.js'
    ]
};



/**
 * Run test once and exit
 */
gulp.task('testPhantom', function (done) {
    //karma.start(_.assign({}, karmaHalService, {singleRun: true}), done);
    karma.start(_.assign({}, karmaPhantomConf, {singleRun: true}), done);
});
gulp.task('test', function (done) {
    //karma.start(_.assign({}, karmaHalService, {singleRun: true}), done);
    karma.start(_.assign({}, karmaApplicationService, {singleRun: true}), done);
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    karma.start(karmaCommonConf, done);
});

//gulp.task('default', ['tdd']);
