const mongoose = require('mongoose');

const recommendationSchema = mongoose.Schema({
    id: String,
    token: String,
    tags: [String]
})

const Recommendation = mongoose.model('recommendations', recommendationSchema);

module.exports = Recommendation;