const mongoose = require('mongoose');

const languagesSchema = mongoose.Schema({
    value: String,
    translation: String
})

const Language = mongoose.model('languages', languagesSchema);

module.exports = Language;