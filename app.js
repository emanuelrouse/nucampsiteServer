// Module imports 
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

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
app.use(cookieParser('helloworld'));
// function auth(req, res, next) {
// 	if (!req.signedCookies.user) {
// 		const authHeader = req.headers.authorization;
// 		if (!authHeader) {
// 			const err = new Error('You are not authenticated!');
// 			res.setHeader('WWW-Authenticate', 'Basic');
// 			err.status = 401;
// 			return next(err);
// 		}

// 		const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
// 		const user = auth[0];
// 		const pass = auth[1];
// 		if (user === 'admin' && pass === 'password') {
// 			res.cookie('user', 'admin', { signed: true });
// 			return next(); // authorized
// 		} else {
// 			const err = new Error('You are not authenticated!');
// 			res.setHeader('WWW-Authenticate', 'Basic');
// 			err.status = 401;
// 			return next(err);
// 		}
// 	} else {
// 		if (req.signedCookies.user === 'admin') {
// 			return next();
// 		} else {
// 			const err = new Error('You are not authenticated!');
// 			err.status = 401;
// 			return next(err);
// 		}
// 	}
// }
function auth(req, res, next) {
	console.log('auth ran')
	// user has not been authenticated
	console.log('headers', req.headers);
	console.log('auth headers', req.headers.authorization);
	console.log('signed cookies prop', req.signedCookies);
	console.log('signed cookies user prop', req.signedCookies.user);

	if (!req.signedCookies.user) {
		console.log('req headers inside first if: ', req.headers)
		console.log('inside first if:', req.signedCookies.user);

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
			console.log('correct credentials passed');

			res.cookie('user', 'admin', { signed: true });
			// res.cookie belongs to express response obj api

			// create a new cookie 

			// pass the name that we want to use for the cookie: user

			//name is used to setup a property of user on the signed cookie object

			// second arguemnt  will be a value to store in the name property: 'admin'

			//third arg[optional] signed true lets express know to use the secret key from cookie parser to create a signed cookie 
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
		// if there is a signedCookie.user value in the income request
		// check if value === admin
		if (req.signedCookies.user === 'admin') {
			console.log(req.signedCookies.user);
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
