// Module imports 
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session); // first class functions: require function returns another fn. then call that return fn with this second parameter list of session

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

function auth(req, res, next) {
	// session automatically adds a property called session to the requests message

	// when the server recieves a cookie from the client, it's able to use the session id stored in that cookie to go into the fileStore and retrieve this info. Then loads info into the req.sessions object

	// The session is attached to the request, so you can access it using req.session

	console.log(req.session);

	if (!req.session.user) {
		console.log('req headers inside first if: ', req.headers);

		const authHeader = req.headers.authorization;
		console.log('authHeader inside first if: ', authHeader);

		if (!authHeader) {
			console.log('authHeader is undefined');

			const err = new Error('You are not authenticated!');
			res.setHeader('WWW-Authenticate', 'Basic');
			// standard error statusCode when the user isn't authenticated is 401
			err.status = 401;
			return next(err);
		}

		// global buffer obj and from method are node specific, split and toString are vanilla js

		// Buffer objects are used to represent a fixed-length sequence of bytes.

		// base 64 encoding is not encyption so this is very unsafe as it can be easily reversed

		// create a Buffer containing the bytes converted from an array of  string values(in this case could be any data type?)
		// character encoding is base64
		const buffer = Buffer.from(authHeader.split(' ')[1], 'base64');
		console.log('Buffer array: ', buffer);

		// The array created from the authHeader being split is converted into base64 format and then converted into a Buffer array of bytes
		// The Buffer array of bytes is then converted into a string
		console.log('BufferArray converted to string: ', buffer.toString());

		// The result is then split into an array at the colon
		console.log(buffer.toString().split(':'));

		const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
		const user = auth[0];
		const pass = auth[1];

		// validation
		if (user === 'admin' && pass === 'password') {
			// This session object can be used to get data out of the session, and also to set data:

			// This data is serialized as JSON when stored, so you are safe to use nested objects.

			// save to the session that the username is admin
			req.session.user = 'admin';
			console.log('correct credentials passed');

			return next(); // authorized
		} else {
			// Unauthorized User
			console.log('unauth user');
			const err = new Error('You are not authenticated!');
			// set header to basic authentication
			// when browser recieves this header it knows to prompt user for credentials
			res.setHeader('WWW-Authenticate', 'Basic');
			// set status property on error obj to 401
			err.status = 401;
			// send off to next middleware
			next(err);
		}
	} else {
		// if there is a session.user value in the income request
		// check if value === admin
		if (req.session.user === 'admin') {
			console.log(req.session.user);
			return next();
		} else {
			const err = new Error('You are not authenticated!');
			err.status = 401;
			return next(err);
		}
	}
}

app.use(auth);
// first middleware that actually sends something back to the client
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
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
