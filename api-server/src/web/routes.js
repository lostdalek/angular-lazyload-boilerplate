var express = require('express');

module.exports = (function() {
    'use strict';
    var router = express.Router();

    /*router.get('/', function(req, res) {
        res.render('index');
    });

    router.get('/partials/:name', function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });*/
    // This route deals enables HTML5Mode by forwarding missing files to the index.html
    router.get('/**', function(req, res) {
        res.header('Content-Type', 'text/html');
        return res.sendFile(__dirname+'/public/index.html');
    });

    return router;
})();
