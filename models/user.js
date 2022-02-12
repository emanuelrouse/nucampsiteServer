const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// Step 1
const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false // ensures no falsy data gets passed
    },
    facebookId: String,
});

// use the method plugin on the Schema itself
// Handles adding username/password fields to the Schema along with hashing and salting the password

// Hashing: run through a hashing algo(scramble the data so it can't be put back into original form) not encryption because it can't be decrypted

// Salt: Add unique, random string before hash, incrasing security

// when the user tries to authenticate, the un and pw will be hashed & salted in the same way then checked for match against stored passwords

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
/*
also works: 
const Users = mongoose.model('User', userSchema);
module.exports = User
*/
