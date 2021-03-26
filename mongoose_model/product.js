const mongoose = require('mongoose');
const MSchema = mongoose.Schema;

const productSchema = new MSchema({
    card_number:String,
    item:String,
    userId: String
})

module.exports = mongoose.model('Product', productSchema)