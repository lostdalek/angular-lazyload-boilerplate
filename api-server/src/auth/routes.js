/**
 * Satellizer Node.js Example
 * (c) 2015 Sahat Yalkabov
 * License: MIT
 */

var path = require('path');
var qs = require('querystring');

var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');
var config = require('../config');
var User = require('../entities/user');

mongoose.connect(config.MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('mongo db connected')
});

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createToken(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}



module.exports = (function() {
    'use strict';
    var auth = express.Router();

    auth.post('/login', function(req, res) {
        User.findOne({ email: req.body.email }, '+password', function(err, user) {
            if (!user) {
                return res.status(401).send({ message: 'Wrong email and/or password' });
            }
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({ message: 'Wrong email and/or password' });
                }
                res.send({ token: createToken(user) });
            });
        });
    });

    auth.post('/signup', function(req, res) {
        User.findOne({ email: req.body.email }, function(err, existingUser) {
            if (existingUser) {
                return res.status(409).send({ message: 'Email is already taken' });
            }
            var user = new User({
                displayName: req.body.displayName,
                email: req.body.email,
                password: req.body.password
            });
            user.save(function() {
                res.send({ token: createToken(user) });
            });
        });
    });

    auth.post('/google', function(req, res) {
        var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
        var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.GOOGLE_SECRET,
            redirect_uri: req.body.redirectUri,
            grant_type: 'authorization_code'
        };

        // Step 1. Exchange authorization code for access token.
        request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
            var accessToken = token.access_token;
            var headers = { Authorization: 'Bearer ' + accessToken };

            // Step 2. Retrieve profile information about the current user.
            request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

                // Step 3a. Link user accounts.
                if (req.headers.authorization) {
                    User.findOne({ google: profile.sub }, function(err, existingUser) {
                        if (existingUser) {
                            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
                        }
                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);
                        User.findById(payload.sub, function(err, user) {
                            if (!user) {
                                return res.status(400).send({ message: 'User not found' });
                            }
                            user.google = profile.sub;
                            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
                            user.displayName = user.displayName || profile.name;
                            user.save(function() {
                                var token = createToken(user);
                                res.send({ token: token });
                            });
                        });
                    });
                } else {
                    // Step 3b. Create a new user account or return an existing one.
                    User.findOne({ google: profile.sub }, function(err, existingUser) {
                        if (existingUser) {
                            return res.send({ token: createToken(existingUser) });
                        }
                        var user = new User();
                        user.google = profile.sub;
                        user.picture = profile.picture.replace('sz=50', 'sz=200');
                        user.displayName = profile.name;
                        user.save(function(err) {
                            var token = createToken(user);
                            res.send({ token: token });
                        });
                    });
                }
            });
        });
    });

    return auth;
})();
