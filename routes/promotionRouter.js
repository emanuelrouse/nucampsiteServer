const express = require('express');
const Promotion = require('../models/promotion');

const promotionRouter = express.Router();
promotionRouter.route('/')
    .get((req, res) => {
        Promotion.find()
            .then((promotions) => {
                res.statusCode = 200;
                res.json(promotions);
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        Promotion.create(req.body)
            .then((promotion) => {
                res.statusCode = 200;
                res.json(promotion);
                promotion.save();
            })
            .catch(err => {
                // How should I handle this error properly?
                console.log(err); res.end()
            });
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res) => {
        Promotion.deleteMany()
            .then((response) => {
                res.statusCode = 200;
                res.json(response);
            })
            .catch(err => next(err));
    });

promotionRouter.route('/:promotionsId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promotionsId)
            .then((promotion) => {
                if (promotion["_id"] == req.params.promotionsId) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion);
                } else {
                    res.statusCode = 400;
                    res.json(`promotions/${req.params.promotionsId} not found.`)
                }
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403; // forbidden
        res.end(`POST operation not supported on /promotions/${req.params.promotionsId}`) // send a message back to the client
    })
    .put((req, res) => {
        const update = { ...req.body };
        // Why does this automatically save? 
        Promotion.findByIdAndUpdate(`${req.params.promotionsId}`, update)
            .then(promotion => {
                // How would I check to see if the promotion exists in the collection?
                // if I pass an incorrect id I get Cannot read property '_id' of null
                console.log(promotion);
                promotion.save(); // save is not nessesary. findByIdAndUpdate automatically performimg the save operation?
                res.end(`Updating the promotion: ${req.params.promotionsId}\n`);
            })
            .catch(errMess => {
                // Is my Error handling setup correctly?
                const err = new Error(errMess);
                return err;
            });
    })
    .delete((req, res) => {
        // Why doesn't this automatically save?
        Promotion.findByIdAndDelete(`${req.params.promotionsId}`)
            .then(promotion => {
                promotion.save();
                res.end(`Promotion ${req.params.promotionsId} deleted.`);
            })
            .catch(err => {
                next(err);
            });
    });

module.exports = promotionRouter;