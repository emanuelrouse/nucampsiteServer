const express = require('express');
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');

const promotionRouter = express.Router();
promotionRouter.route('/')
    .get((req, res) => {
        Promotion.find()
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res) => {
        Promotion.create(req.body)
            .then((promotion) => {
                console.log('Promotion Created ', promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        // put is not supported here because we wouldn't want to update the whole array of partners
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(authenticate.verifyUser, (req, res) => {
        Promotion.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

promotionRouter.route('/:promotionsId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promotionsId)
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403; // forbidden
        res.end(`POST operation not supported on /promotions/${req.params.promotionsId}`);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promotionsId, {
            $set: req.body
        }, { new: true })
            .then(promotion => {
                // save the promotion document
                res.statusCode = 200;
                promotion.save();
                res.setHeader('Content-Type', 'application/json');
                res.json(`Updating the promotion: ${req.params.promotionsId}`);
            })
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res) => {
        Promotion.findByIdAndDelete(`${req.params.promotionsId}`)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

module.exports = promotionRouter;