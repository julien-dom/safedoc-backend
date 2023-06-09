const mongoose = require('mongoose');

const orientationSchema = mongoose.Schema({
  value: String,
});

const Orientation = mongoose.model('orientations', orientationSchema);

module.exports = Orientation;