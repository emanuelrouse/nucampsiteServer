const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        // Best to set a default here to ensure we're not storing undefind || null on a Boolean
        default: false
    },
    cost: {
        type: Currency,
        required: true
    },
    description: {
        type: String,
        required: true
    }


}, { timestamps: true });
const Promotions = mongoose.model("Promotion", promotionSchema);
module.exports = Promotions;

