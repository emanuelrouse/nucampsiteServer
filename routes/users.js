const express = require('express');
const User = require('../models/user');
const passport = require('passport');

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
  .post((req, res) => {
    // when the user is trying to post new registration data: req.body
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      err => {
        if (err) {
          res.statusCode = 500; // Internal Server Error
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        } else {
          // authenticate returns a fn 
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        }
      }
    );
  })

usersRouter.route('/login', passport.authenticate('local'))
  .post((req, res) => {
    // passport reduces the amount of code by a lot
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'You are succesfully logged in!' });
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
