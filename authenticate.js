const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

function verifyAdmin(req, res, next) {
    console.log('user obj', req.user);
    console.log(req.user);
    if (req.user.admin) {
        res.statusCode = 200;
        next();
    } else {
        // this will only run if there is user credentials but the admin property is false
        // otherwise it will send a 401 error 
        const err = new Error('You are not authorized to perfom this operation!');
        res.statusCode = 403;
        return next(err);
    }
}

exports.verifyAdmin = verifyAdmin;
exports.verifyUser = passport.authenticate('jwt', { session: false });