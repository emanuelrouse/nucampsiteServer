// Module imports 
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session); // first class functions: require function returns another fn. then call that return fn with this second parameter list of session
const passport = require('passport');
const authenticate = require('./authenticate');

// Router imports
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

// Setup express instance
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321')); // Using cookie-parser may result in issues if the secret is not the same between this module and cookie-parser.

app.use(session({
	// options may change depending on use case
	name: 'session-id',
	secret: '12345-67890-09876-54321', // secret is the only required parameter, but there are many more you can use. It should be a randomly unique string for your application.
	saveUninitialized: false, // prevents empty session files and cookies 
	resave: false, // once a session has been created and updated and save it will continue to resave: helps mark session as active
	store: new FileStore() // create a new filestore as an object that's used to save the sessions info to the servers hard disk instead of the just the running apps memory
}))

// Only needed if you're using passport authentication
// Check if existing info for the client then loaded into the client as req.user
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
	console.log(req.user);

	if (!req.user) {
		// if no user then there is no session loaded for the client so they're not authenticated
		const err = new Error('You are not authenticated!');
		err.status = 401;
		return next(err);
	} else {
		return next();
	}
}

app.use(auth);
// first middleware that actually sends something back to the client
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// setup mongoose and options
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Another way to handle errors other than catch method is to pass the err a second argument to the .then
connect.then(() => console.log('Connected correctly to server'),
	err => console.log(err)
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
