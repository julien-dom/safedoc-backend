var express = require('express');
var router = express.Router();

const Gender = require('../models/genders');

// GET /genders

router.get('/', async (req, res) => {
  try {
    const genders = await Gender.find();
    res.json({ result: true, length: genders.length, genders: genders });
  } catch (error) {
    res.json({result: false, error: "An error occurred while retrieving genders" });
  }
});

// POST /genders

router.post('/', async (req, res) => {
  try {
    const { value } = req.body;

    const newGender = new Gender({ value });

    await newGender.save();

    res.status(201).json({ success: true, gender: newGender });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
