const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// Create a Subdocument
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

// Create the Schema
const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        require: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

// Convert the campsiteSchema into a model
// Generate a Model
// Desugared class because mongoose was written before ES6 Classes 
// first arg: Mongoose automatically looks for the plural, lowercased version of your model name
// 'Campsite' = 'campsites'
const Campsite = mongoose.model('Campsite', campsiteSchema); // returns a constructor fn
module.exports = Campsite; 
