const express = require('express');
const path = require('path');
const router = express.Router();
const { readJSON } = require('../utils/jsonHelper');

const THEMES_PATH = path.join(__dirname, '..', 'data', 'themes.json');


//GET /api/themes
router.get('/', (req, res) => {
    try {
        const themes = readJSON(THEMES_PATH);
    } catch (err) {
        console.error('[GET /api/themes]', err.message);
        res.status(500).json({ error: 'Failed to read themes data' });
    }
});
 
module.exports = router;