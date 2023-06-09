const mongoose = require('mongoose');

const confidentialitySchema = mongoose.Schema({
    value: Number,
    description: String
})

const Confidentiality = mongoose.model('confidentialities', confidentialitySchema);

module.exports = Confidentiality;