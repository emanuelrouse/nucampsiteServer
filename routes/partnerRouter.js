const express = require('express');
const Partner = require('../models/partner');

const partnerRouter = express.Router();
partnerRouter.route('/')
        .get((req, res) => {
                Partner.find()
                        .then((partners) => {
                                res.statusCode = 200;
                                res.json(partners);
                        })
                        .catch(err => next(err));
        })
        .post((req, res) => {
                Partner.create(req.body)
                        .then((partner) => {
                                res.statusCode = 200;
                                res.json(partner);
                                partner.save();
                        })
                        .catch(err => next(err));
        })
        .put((req, res) => {
                res.statusCode = 403;
                res.end('PUT operation not supported on /partners');
        })
        .delete((req, res) => {
                Partner.deleteMany()
                        .then((response) => {
                                res.statusCode = 200;
                                res.json(response);
                        })
                        .catch(err => next(err));
        });

partnerRouter.route('/:partnersId')
        .get((req, res, next) => {
                Partner.findById(req.params.partnersId)
                        .then((partner) => {
                                if (partner["_id"] == req.params.partnersId) {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(partner);
                                } else {
                                        res.statusCode = 400;
                                        res.json(`partners/${req.params.partnersId} not found.`)
                                }
                        })
                        .catch(err => next(err));
        })
        .post((req, res) => {
                res.statusCode = 403; // forbidden
                res.end(`POST operation not supported on /partners/${req.params.partnersId}`) // send a message back to the client
        })
        .put((req, res) => {
                const update = { ...req.body };
                // Why does this automatically save? 
                Partner.findByIdAndUpdate(`${req.params.partnersId}`, update)
                        .then(partner => {
                                // How would I check to see if the partner exists in the collection?
                                // if I pass an incorrect id I get Cannot read property '_id' of null
                                console.log(partner);
                                partner.save(); // save is not nessesary. findByIdAndUpdate automatically performimg the save operation?
                                res.end(`Updating the partner: ${req.params.partnersId}\n`);
                        })
                        .catch(errMess => {
                                // Is my Error handling setup correctly?
                                const err = new Error(errMess);
                                return err;
                        });
        })
        .delete((req, res) => {
                // Why doesn't this automatically save?
                Partner.findByIdAndDelete(`${req.params.partnersId}`)
                        .then(partner => {
                                partner.save();
                                res.end(`Partner ${req.params.partnersId} deleted.`);
                        })
                        .catch(err => {
                                next(err);
                        });
        });

module.exports = partnerRouter;