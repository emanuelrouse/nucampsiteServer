const express = require('express');
const Partner = require('../models/partner');
const authenticate = require('../authenticate')

const partnerRouter = express.Router();

partnerRouter.route('/')
	.get((req, res) => {
		Partner.find()
			.then((partners) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partners);
			})
			.catch(err => next(err));
	})
	.post(authenticate.verifyUser, (req, res) => {
		Partner.create(req.body)
			.then(partner => {
				res.statusCode = 200;
				res.json(partner);
			})
			.catch(err => next(err));
	})
	.put(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /partners');
	})
	.delete(authenticate.verifyUser, (req, res) => {
		Partner.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch(err => next(err));
	});

partnerRouter.route('/:partnersId')
	.get((req, res, next) => {
		Partner.findById(req.params.partnersId)
			.then(partner => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(partner);
			})
			.catch(err => next(err));
	})
	.post(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403; // forbidden
		res.setHeader('Content-Type', 'application/json');
		res.json(`POST operation not supported on /partners/${req.params.partnersId}`) // send a message back to the client
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		Partner.findByIdAndUpdate(req.params.partnersId, {
			$set: req.body
		}, { new: true })
			.then(partner => {
				res.setHeader('Content-Type', 'application/json');
				res.json(partner);
			})
			.catch(err => next(err));
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		Partner.findByIdAndDelete(req.params.partnersId)
			.then(response => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch(err => next(err));
	});

module.exports = partnerRouter;