var express = require('express');
var router = express.Router();

const Tag = require('../models/tags');

// GET /tags

router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json({ result: true, length: tags.length, tags: tags });
    } catch (error) {
        res.json({ result: false, error: "An error occurred while retrieving tags" });
    }
});

// POST /tags

router.post('/', async (req, res) => {
    try {
        const { value, category } = req.body;
        const newTag = new Tag({ value, category });

        await newTag.save();

        res.status(201).json({ success: true, tag: newTag });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
