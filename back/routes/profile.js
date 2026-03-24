const express = require('express');
const router = express.Router();
const readJSON = require('../utils/readJSON');
 
// GET /api/profile
// Retourne les informations du profil
router.get('/profile', (req, res) => {
  try {
    const profile = readJSON('profile.json');
 
    res.json(profile);
  } catch (error) {
    console.error('Erreur lecture profile.json :', error.message);
    res.status(500).json({ error: 'Failed to read profile data' });
  }
});
 
module.exports = router;