var express = require('express');
var router = express.Router();

const Sector = require('../models/sectors');

// GET /sectors

router.get('/', async (req, res) => {
    try {
        const sectors = await Sector.find();
        res.json({ result: true, length: sectors.length, sectors: sectors });
    } catch (error) {
        res.json({ result: false, error: "An error occurred while retrieving sectors" });
    }
});

// POST /sectors

router.post('/', async (req, res) => {
    try {
        const { value, description } = req.body;

        const newSector = new Sector({ value, description });

        await newSector.save();

        res.status(201).json({ success: true, sector: newSector });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
