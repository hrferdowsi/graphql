const mongoose = require('mongoose');
const MSchema = mongoose.Schema;

const userSchema = new MSchema({
    name: String,
    age: Number,
    professional: String
})

module.exports = mongoose.model('User', userSchema);