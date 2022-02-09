const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Add the specific passport strategy
// create a new instance of  Local Strategy 
// LocalStrategy requires a verify cb function.
// passportLocal has a method on it called authenticate and its coming from the user 
// passport supports both session based as well as token based authenticate
// User must be seriazlied and deserialized
// Upon successful verification:  User data must be grabed from the session and added to the req object: deserialization must be used in order from this to be possible
// When req obj gives us data and it must be stored serialization must happen
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());