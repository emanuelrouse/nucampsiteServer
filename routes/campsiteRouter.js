const express = require('express');
const Campsite = require('../models/campsite');

const campsiteRouter = express.Router();

// each router will act like middleware and can be used as a callback arg for app.use
campsiteRouter.route('/')
        .get((req, res, next) => {
                // find returns a query that you can use a .then function on it is NOT a promise
                Campsite.find()
                        .then(campsites => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(campsites);
                        })
                        .catch(err => next(err));
        })
        .post((req, res, next) => {
                // create returns a promise
                Campsite.create(req.body)
                        .then(campsite => {
                                console.log('Campsite Created ', campsite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(campsite);
                        })
                        .catch(err => next(err));
        })
        .put((req, res) => {
                res.statusCode = 403;
                res.end('PUT operation not supported on /campsites');
        })
        .delete((req, res, next) => {
                Campsite.deleteMany()
                        .then(response => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(response);
                        })
                        .catch(err => next(err));
        });

campsiteRouter.route('/:campsiteId')
        .get((req, res, next) => {
                Campsite.findById(req.params.campsiteId)
                        .then(campsite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(campsite);
                        })
                        .catch(err => next(err));
        })
        .post((req, res) => {
                res.statusCode = 403; // forbidden
                res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`) // send a message back to the client
        })
        .put((req, res, next) => {
                Campsite.findByIdAndUpdate(req.params.campsiteId, {
                        $set: req.body
                }, { new: true })
                        .then(campsite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(campsite);
                        })
                        .catch(err => next(err));
        })
        .delete((req, res, next) => {
                Campsite.findByIdAndDelete(req.params.campsiteId)
                        .then(response => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(response);
                        })
                        .catch(err => next(err));
        });

module.exports = campsiteRouter;
