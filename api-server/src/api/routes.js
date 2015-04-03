var express = require('express');
var teamEntity   = require('../entities/team');
var playerEntity = require('../entities/player');
var resourceEntity = require('../entities/resource');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');
var User = require('../entities/user');

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}


module.exports = (function() {
    'use strict';
    var api = express.Router();

    api
        .get('/me', ensureAuthenticated, function(req, res) {
            User.findById(req.user, function(err, user) {
                res.send(user);
            });
        })
        .put('/me', ensureAuthenticated, function(req, res) {
            User.findById(req.user, function(err, user) {
                if (!user) {
                    return res.status(400).send({ message: 'User not found' });
                }
                user.displayName = req.body.displayName || user.displayName;
                user.email = req.body.email || user.email;
                user.save(function(err) {
                    res.status(200).end();
                });
            });
        })
        .get('/player',  function (req, res) {
            // query string: req.query
            res.send({
                    "_embedded" : playerEntity().list(),
                    "meta" : {
                        "page" : 1,
                        "pages" : 1,
                        "total" : 1,
                        "per_page" : 10
                    }
                }
            );
        })
        .get('/player/:id',  function (req, res) {
            res.send(playerEntity().get(req.params.id));
        })
        .post('/player',  function (req, res) {
            res.send(201, null);
        })
        .put('/player',  function (req, res) {
            res.send(400, null);
        })
        .get('/team',  function (req, res) {
            // query string: req.query
            res.send({
                    "_embedded" : teamEntity().list(),
                    "meta" : {
                        "page" : 1,
                        "pages" : 1,
                        "total" : 1,
                        "per_page" : 10
                    }
                }
            );
        })
        .get('/team/:id',  function (req, res) {
            res.send(teamEntity().get(req.params.id));
        })
        .post('/team',  function (req, res) {
            res.send(201, null);
        })
        .put('/team',  function (req, res) {
            res.send(400, null);
        })
        .get('/resource',  function (req, res) {
            // query string: req.query
            res.send({
                    "_embedded" : resourceEntity().list(),
                    "meta" : {
                        "page" : 1,
                        "pages" : 1,
                        "total" : 1,
                        "per_page" : 10
                    }
                }
            );
        });

    return api;
})();
