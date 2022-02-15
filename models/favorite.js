const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Should I import the user model?

const favoriteSchema = new Schema({
    user: {
        // An ObjectId is a special type typically used for unique identifiers.
        type: mongoose.Schema.Types.ObjectId,
        // The ref option is what tells mongoose which model to use during population
        ref: 'User'
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Favorite', favoriteSchema);

// Random Tests
// const favorite = new Favorite();
// favoriteSchema.user = new mongoose.Types.ObjectId;
// console.log('favorite Schema', typeof favorite.user);

// const Favorite = mongoose.model('Favorite', favoriteSchema);

// const favorite = new Favorite();
// favorite.user = new mongoose.Types.ObjectId();

// const userType = typeof favorite.user; // 'object'
// console.log(userType);
// favorite.user instanceof mongoose.Types.ObjectId; // true

// const userString = favorite.user.toString(); // Something like "5e1a0651741b255ddda996c4"\
// console.log(userString);