const mongoose = require('mongoose');

const genderSchema = mongoose.Schema({
  value: String,
});

const Gender = mongoose.model('genders', genderSchema);

module.exports = Gender;