const mongoose = require('mongoose');

const sectorSchema = mongoose.Schema({
    value: Number,
    description: String
})

const Sector = mongoose.model('sectors', sectorSchema);

module.exports = Sector;