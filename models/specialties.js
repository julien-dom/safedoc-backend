const mongoose = require('mongoose');

const specialtiesSchema = mongoose.Schema({
    value: String,
})

const Speciality = mongoose.model('specialties', specialtiesSchema);

module.exports = Speciality;