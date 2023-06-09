const express = require('express');
const router = express.Router();
const Recommendation = require('../models/recommendations');

// GET / recommendations

router.get('/', async (req, res) => {
  try {
    const recommendations = await Recommendation.find();
    res.json({ result: true, length: recommendations.length, recommendations: recommendations });
  } catch (error) {
    res.json({ result: false, error: 'An error occurred while retrieving recommendations' });
  }
});

// DELETE / recommendations

router.delete('/', async (req, res) => {
  try {
    const deleted = await Recommendation.deleteMany({});
    if (deleted) {
      res.json({ result: true, message: 'Recommendation collection successfully deleted' });
    } else {
      res.json({ result: false, error: 'Failed to delete collection Recommendation' });
    }
  } catch (error) {
    res.json({ result: false, error: 'An error occurred while deleting recommendations' });
  }
});

module.exports = router;
