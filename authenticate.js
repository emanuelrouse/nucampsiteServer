const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Add the specific passport strategy
// create a new instance of  Local Strategy 
// LocalStrategy requires a verify cb function.
// passport supports both session based as well as token based authenticate
// User must be seriazlied and deserialized
// Upon successful verification:  User data must be grabed from the session and added to the req object: deserialization must be used in order from this to be possible
// When req obj gives us data and it must be stored serialization must happen
// the autheticate method here is a verifyCallback fn
// What is the underlying authentication mechanism here?
// does it involve using shared secrets? e.g passwords?
// does this provide cryptographic authentication? if so it would typically yield a user and a key afterwards using cryptographical verification of the credential.
// the verify fn yeilds under one of three conditions: success, failure, or an error
// static method on the model called authenticate that will be used as the verifyFunction for the LocalStrategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());