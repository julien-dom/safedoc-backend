var express = require('express');
var router = express.Router();

const Speciality = require('../models/specialties');

// GET /specialties

router.get('/', async (req, res) => {
    try {
        const specialties = await Speciality.find();
        res.json({ result: true, length: specialties.length, specialties: specialties });
    } catch (error) {
        res.json({ result: false, error: "An error occurred while retrieving specialties" });
    }
});

// POST /specialties

router.post('/', async (req, res) => {
    try {
        const { value } = req.body;

        const newSpeciality = new Speciality({ value });

        await newSpeciality.save();

        res.status(201).json({ success: true, speciality: newSpeciality });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

