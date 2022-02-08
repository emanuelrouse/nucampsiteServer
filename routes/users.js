const express = require('express');
const User = require('../models/user');
const usersRouter = express.Router();

usersRouter.route('/')
  .get(function (req, res, next) {
    User.find()
      .then(users => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      })
      .catch(err => {
        next(err);
      });
  });

usersRouter.route('/signup')
  .post((req, res, next) => {
    // check if username exists
    // how do I check the db for users
    User.findOne({ username: req.body.username })
      .then(user => {
        if (user) {
          const err = new Error(`User ${req.body.username} already exists!`);
          err.status = 403; // forbidden
          next(err);
        } else {
          User.create({
            username: req.body.username,
            password: req.body.password,
            // admin is left out so that the client cant send a value and turn themselves into admins
          })
            .then(user => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ status: 'Registration Successful', user: user })
            })
            .catch(err => next(err))
        }
      })
      .catch(err => next(err));
  })

usersRouter.route('/login')
  .post((req, res, next) => {
    if (!req.session.user) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        console.log('authHeader is undefined');

        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const username = auth[0];
      const password = auth[1];

      User.findOne({ username: username })
        .then(user => {
          if (!user) {
            // user doesn't exist in database
            const err = new Error(`User ${username} does not exist!`);
            err.status = 401;
            next(err);
          } else if (user.password !== password) {
            // password is not correct
            const err = new Error('Your password is incorrect!');
            err.status = 401;
            return next(err);
          } else if (user.username === username && user.password === password) {
            // both the username and the password exist in the database
            req.session.user = 'authenticated';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You are authenticated');
          }
        })
        .catch(err => next(err));
    } else {
      // user is already logged in
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
  });

usersRouter.route('/logout')
  .get((req, res, next) => {
    if (req.session) {
      // delete session file on server side
      req.session.destroy();
      // express method on response object passing session id: clears cookie that's stored in the client
      res.clearCookie('session-id');
      // Redirect the user to the root path
      res.redirect('/');
    } else {
      // if a session does not exist
      const err = new Error('You are not logged in!')
      err.status = 401;
      return next(err);
    }
  })
module.exports = usersRouter;
