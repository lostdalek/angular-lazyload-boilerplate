var config      = require('../config'),
    gutil       = require('gulp-util'),
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    path        = require('path'),
    fs          = require('fs'),
    es          = require('event-stream'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    connect     = require('gulp-connect'),
    concatJson2js      = require('gulp-concat-json2js'),
    sourcemaps  = require('gulp-sourcemaps'),
    ngAnnotate  = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'),
    uglify      = require('gulp-uglify'),
    size = require('gulp-size');


function getFolders(dir){
    return fs.readdirSync(dir)
        .filter(function(file){
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}


gulp.task('concat', [ 'concat-modules', 'concat-templates', 'concat-vendors'], function(){
    var folders = getFolders(config.TMP_JS);


    // once app and template generated, concat them all:

    var tasks = folders.map(function(folder) {
        return gulp.src([path.join(config.TMP_JS, folder, folder+'.js'), path.join(config.TMP_JS, folder, folder+'Templates.js')])
            .pipe(concat(folder + '.js'))
            .pipe(gulp.dest(config.TMP_JS))
            // we cannot mangle because ngAnnotage fail to annotate lazy loaded modules (because of Ctrl as crtlAlias syntax?)
            //.pipe(gulpif(config.env.jsUglify , uglify({mangle: false}) ))
            .pipe(rename(folder + '.js'))
            .pipe(gulp.dest(path.join(config.DIST, folder)));
    });

    return es.concat.apply(null, tasks);
});
gulp.task('concat-modules', function(){
    var folders = getFolders(config.SRC_JS);

    var tasks = folders.map(function(folder) {
        return gulp.src([path.join(config.SRC_JS, folder, 'module.js'), path.join(config.SRC_JS, folder, '**/*.js')])
            .pipe(gulpif(config.env.jsSourceMaps , sourcemaps.init()))
            .pipe(concat(folder + '.js'))
            //.pipe(gulpif(config.env.jsUglify , ngAnnotate() )) // fix uglify mangleling - not compatible with sourceMaps
            // we cannot mangle because ngAnnotage fail to annotate lazy loaded modules (because of Ctrl as crtlAlias syntax?)
            // let's uglify later
            .pipe(gulpif(config.env.jsUglify , uglify() )) //{mangle:false}
            .pipe(rename(folder + '.js'))
            .pipe(gulpif(config.env.jsSourceMaps , sourcemaps.write()))
            .pipe(gulp.dest(path.join(config.TMP_JS, folder)));
    });

    return es.concat.apply(null, tasks);
});

gulp.task('concat-vendors', function(){
    // concat application vendors
    return gulp.src([path.join(config.SRC_JS,"vendors.json")])
        //.pipe(gulpif(config.env.jsSourceMaps , sourcemaps.init()))
        .pipe(concatJson2js('vendors.js'))
        .pipe(gulpif(config.env.jsUglify , ngAnnotate() )) // fix uglify mangleling - not compatible with sourceMaps
        .pipe(gulpif(config.env.jsUglify , uglify() ))
        .pipe(rename({basename: 'vendors',suffix: '.min'})) //,suffix: '.min'
        //.pipe(gulpif(config.env.jsSourceMaps , sourcemaps.write()))
        .pipe(gulp.dest(path.join(config.DIST, 'vendors')))
});

gulp.task('concat-templates', function(){
    var folders = getFolders(config.SRC_JS);
    // before build JS we need to regenerate template file:
    var tasks = folders.map(function(folder) {
        return gulp.src(path.join(config.SRC_JS, folder, "**/*.html")) //'./app/src/**/*.html')
            .pipe(templateCache({
                filename: folder+'CachedTemplates.js',
                module: folder, //+'CachedTemplates',
                root: folder
                //standalone: true
            }))
            .pipe(rename(folder + 'Templates.js'))
            .pipe(gulp.dest(path.join(config.TMP_JS,folder)));
    });

    return es.concat.apply(null, tasks);
});
