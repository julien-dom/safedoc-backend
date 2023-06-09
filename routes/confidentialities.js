var express = require('express');
var router = express.Router();

const Confidentiality = require('../models/confidentialities');

// GET /confidentialities

router.get('/', async (req, res) => {
    try {
        const confidentialities = await Confidentiality.find();
        res.json({ result: true, length: confidentialities.length, confidentialities: confidentialities });
    } catch (error) {
        res.json({ result: false, error: "An error occurred while retrieving confidentialities" });
    }
});

module.exports = router;
