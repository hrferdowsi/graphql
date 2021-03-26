const mongoose = require ('mongoose');
const MSchema = mongoose.Schema;


const credit_scoreSchema = new MSchema({
    risk_level: String,
    score: Number,
    userId: String
})
module.exports = mongoose.model('Credit_Score',credit_scoreSchema);

