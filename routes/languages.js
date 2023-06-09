var express = require('express');
var router = express.Router();

const Language = require('../models/languages');

// GET /languages

router.get('/', async (req, res) => {
    try {
        const languages = await Language.find();
        res.json({ result: true, length: languages.length, languages: languages });
    } catch (error) {
        res.json({ result: false, error: "An error occurred while retrieving languages" });
    }
});

// POST /languages

router.post('/', async (req, res) => {
    try {
        const { value, translation } = req.body;

        const newLanguage = new Language({ value, translation });

        await newLanguage.save();

        res.status(201).json({ success: true, language: newLanguage });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
