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
app.use(cookieParser());

function auth(req, res, next) {
	console.log(req.headers);
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		const err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		// standard error statusCode when the user isn't authenticated is 401
		err.status = 401;
		return next(err);
	}

	const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
	const user = auth[0];
	const pass = auth[1];

	// basic validation
	if (user === 'admin' && pass === 'password') {
		return next(); // authorized
	} else {
		// Unauthorized User
		const err = new Error('You are not authenticated!');
		// set header to basic authentication
		res.setHeader('WWW-Authenticate', 'Basic');
		// set status property on error obj to 401
		err.status = 401;
		// send off to next middleware
		next(err);
	}
}

app.use(auth);
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
