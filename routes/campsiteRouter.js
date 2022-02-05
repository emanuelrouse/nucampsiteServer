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

campsiteRouter.route('/:campsiteId/comments')
	.get((req, res, next) => {
		// find returns a query that you can use a .then function on it is NOT a promise
		Campsite.findById(req.params.campsiteId)
			.then(campsite => {
				if (campsite) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(campsite.comments);
				}
				else {
					err = new Error(`Campsite ${req.params.campsiteId} not found`);
					err.status = 404;
					return next(err);
				}
			})
			.catch(err => next(err));
	})
	.post((req, res, next) => {
		// create returns a promise
		Campsite.findById(req.params.campsiteId)
			.then(campsite => {
				if (campsite) {
					campsite.comments.push(req.body);
					campsite.save()
						.then(campsite => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(campsite);
						})
						.catch(err => next(err));
				}
				else {
					err = new Error(`Campsite ${req.params.campsiteId} not found`);
					err.status = 404;
					return next(err);
				}
			})
			.catch(err => next(err));
	})
	.put((req, res) => {
		res.statusCode = 403;
		res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
	})
	.delete((req, res, next) => {
		// mongoose static helper fn for Delete Operation
		Campsite.findById(req.params.campsiteId)
			// returns a Query object which is thenable thus allowing then fn chaining
			.then(campsite => {
				// campsite would represent the variable holding the data from the model?
				if (campsite) {
					// if there is a found campsite object in the query
					// loop through each of the campsites comments 
					// stop at the first comment in the array
					// campsite.comments[0, 1, 2, 3].length - 1
					// first iteration = 4 - 1 [3]
					for (let i = (campsite.comments.length - 1); i >= 0; i--) {
						// Find the subdocument. Each subdocument has an _id by default. mongoose document arrays have a special id method for searching a document array to find a document with a given _id
						// remove that comment
						// remove() is equivalient to calling .pull() on the subdocument
						campsite.comments.id(campsite.comments[i]._id).remove();
					}
					campsite.save()
						.then(campsite => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(campsite);
						})
						.catch(err => next(err));
				}
				else {
					err = new Error(`Campsite ${req.params.campsiteId} not found`);
					err.status = 404;
					return next(err);
				}
			})
			.catch(err => next(err));
	});

// /:campsiteId/comments/:commentId Endpoints
campsiteRouter.route('/:campsiteId/comments/:commentId')
	.get((req, res, next) => {
		// find returns a query that you can use a .then function on it is NOT a promise
		Campsite.findById(req.params.campsiteId)
			.then(campsite => {
				if (campsite && campsite.comments.id(req.params.commentId)) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(campsite.comments.id(req.params.commentId));
				} else if (!campsite) {
					err = new Error(`Campsite ${req.params.campsiteId} not found`);
					err.status = 404;
					return next(err);
				}
				else {
					console.log(req.params.commentId);
					err = new Error(`Comment ${req.params.commentId} not found`);
					err.status = 404;
					return next(err);
				}
			})
			.catch(err => next(err));
	})
	.post((req, res) => {
		res.statusCode = 403;
		res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}}`)
	})
	.put((req, res) => {
		Campsite.findById(req.params.campsiteId)
			.then(campsite => {
				if (campsite && campsite.comments.id(req.params.commentId)) {
					if (req.body.rating) {
						campsite.comments.id(req.params.commentId).rating = req.body.rating;
					}

					if (req.body.text) {
						campsite.comments.id(req.params.commentId).text = req.body.text;
					}

					campsite.save()
						.then(campsite => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(campsite);
						}).catch(err => next(err))
				} else if (!campsite) {
					err = new Error(`Campsite ${req.params.campsiteId} not found`);
					err.status = 404;
					return next(err);
				}
				else {
					err = new Error(`Campsite ${req.params.commentId} not found`);
					err.status = 404;
					return next(err);
				}
			})
			.catch(err => next(err));
	})
	.delete((req, res, next) => {
		Campsite.findById(req.params.campsiteId)
			.then(campsite => {
				if (campsite && campsite.comments.id(req.params.commentId)) {
					campsite.comments.id(req.params.commentId).remove();
					campsite.save()
						.then(campsite => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(campsite);
						}).catch(err => next(err))
				} else if (!campsite) {
					err = new Error(`Campsite ${req.params.campsiteId} not found`);
					err.status = 404;
					return next(err);
				}
				else {
					err = new Error(`Campsite ${req.params.commentId} not found`);
					err.status = 404;
					return next(err);
				}
			})
			.catch(err => next(err));
	});

module.exports = campsiteRouter;