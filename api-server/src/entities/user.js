var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    displayName: String,
    picture: String,
    facebook: String,
    foursquare: String,
    google: String,
    github: String,
    linkedin: String,
    live: String,
    yahoo: String,
    twitter: String
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};


/**
 * Methods
 */

UserSchema.methods = {

    comparePassword: function(password, done) {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            done(err, isMatch);
        });
    }
};

/**
 * Statics
 */

UserSchema.statics = {

    /**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function (options, cb) {
        options.select = options.select || 'name username';
        this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    }
};

module.exports = mongoose.model('User', UserSchema);

