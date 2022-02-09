const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    // passportLocalMongoose handles adding username and password along with hashing and salting
    admin: {
        type: Boolean,
        default: false // ensures no falsy data gets passed
    }
});

// use the method plugin on the Schema itself
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
/*
also works: 
const Users = mongoose.model('User', userSchema);
module.exports = User
*/
