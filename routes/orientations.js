var express = require('express');
var router = express.Router();

const Orientation = require('../models/orientations');

// GET /orientations

router.get('/', async (req, res) => {
  try {
      const orientations = await Orientation.find();
      res.json({ result: true, length: orientations.length, orientations: orientations });
  } catch (error) {
      res.json({ result: false, error: "An error occurred while retrieving orientations" });
  }
});

// POST /orientations

router.post('/', async (req, res) => {
  try {
    const { value } = req.body;

    const newOrientation = new Orientation({ value });

    await newOrientation.save();

    res.status(201).json({ success: true, orientation: newOrientation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
