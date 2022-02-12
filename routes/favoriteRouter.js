const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        // When user does GET 
        // Retrieve the favorite document for that user
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites)
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // [{"_id:"campsite ObjectId"}, ..., {"_id":"campsite ObjectId"}]
        // in the body of the message 
        // check if the user has an associated favorite document
        // Favorite.findOne({user:req.user._id})
        // then check if favorite document exists
        // if so check which campsites in req.body are aleady in the campsites array of the favorite docvument
        // if any, only add to the document those that are not already there
        // forEach, includes, and push can work
        // if no favoriate document for the user
        // create a favorite document for the user 
        // add the campsiteIDs from the req.body to the campsites array for the document
        // Save the favorite document
        // set the response Content-Type header 
        // Status code 200
        // send the response back res.json(favorite) 
    })
// .put()
// .delete();
// favoriteRouter.route('/:campsiteId')
// .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

module.exports = favoriteRouter;
