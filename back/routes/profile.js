// const express = require('express');
// const router = express.Router();
// const readJSON = require('../utils/readJSON');
 
// // GET /api/profile
// // Retourne les informations du profil
// router.get('/profile', (req, res) => {
//   try {
//     const profile = readJSON('profile.json');
 
//     res.json(profile);
//   } catch (error) {
//     console.error('Erreur lecture profile.json :', error.message);
//     res.status(500).json({ error: 'Failed to read profile data' });
//   }
// });
 
// module.exports = router;
//-----------------------------------------------------------------------------



const express = require('express');
const path = require('path');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/jsonHelper');

const PROFILE_PATH = path.join(__dirname, '..', 'data', 'profile.json');
const THEMES_PATH  = path.join(__dirname, '..', 'data', 'themes.json');

// GET /api/profile
router.get('/profile', (req, res) => {
  try {
    const profile = readJSON(PROFILE_PATH);
    res.json(profile);
  } catch (err) {
    console.error('[GET /api/profile]', err.message);
    res.status(500).json({ error: 'Failed to read profile data' });
  }
});

// PUT /api/profile
router.put('/profile', (req, res) => {
  try {
    const updates = req.body;

    // Validation
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || updates.name.trim().length === 0) {
        return res.status(400).json({ error: 'Name must be a non-empty string' });
      }
      if (updates.name.length > 50) {
        return res.status(400).json({ error: 'Name must be 50 characters or less' });
      }
    }

    if (updates.avatar !== undefined) {
      if (typeof updates.avatar !== "string") {
        return res.status(400).json({ error: "Avatar must be a string" });
      }
      
      // Accepte soit une chaîne base64 data URI, soit une URL, soit vide
      const isBase64  = updates.avatar.startsWith("data:image/")
      const isURL     = updates.avatar.startsWith("http")
      const isEmpty   = updates.avatar === ""
      if (!isBase64 && !isURL && !isEmpty) {
        return res.status(400).json({ error: "Avatar must be a base64 data URI (data:image/...), a URL, or an empty string" });
      }
    }

    if (updates.bio !== undefined && updates.bio.length > 160) {
      return res.status(400).json({ error: 'Bio must be 160 characters or less' });
    }

    if (updates.socialLinks !== undefined) {
      if (!Array.isArray(updates.socialLinks)) {
        return res.status(400).json({ error: 'socialLinks must be an array' });
      }
      for (const link of updates.socialLinks) {
        if (!link.platform || !link.url) {
          return res.status(400).json({ error: 'Each social link must have a platform and a url' });
        }
      }
    }

    // Lecture + merge 
    const currentProfile = readJSON(PROFILE_PATH);

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      colors: updates.colors
        ? { ...currentProfile.colors, ...updates.colors }
        : currentProfile.colors,
    };

    writeJSON(PROFILE_PATH, updatedProfile);

    res.json(updatedProfile);
  } catch (err) {
    console.error('[PUT /api/profile]', err.message);
    res.status(500).json({ error: 'Failed to update profile data' });
  }
});



router.put('/profile/theme', (req, res) => {
  try {
    const { themeId } = req.body;
 
    if (!themeId || typeof themeId !== 'string') {
      return res.status(400).json({ error: 'themeId is required' });
    }
 
    // Recherche du thème
    const themes = readJSON(THEMES_PATH);
    const theme  = themes.find(t => t.id === themeId);
 
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
 
    // Mise à jour du profil : on écrase theme ET colors avec ceux du thème choisi
    const currentProfile = readJSON(PROFILE_PATH);
 
    const updatedProfile = {
      ...currentProfile,
      theme:  theme.id,
      colors: { ...theme.colors },
    };
 
    writeJSON(PROFILE_PATH, updatedProfile);
 
    res.json(updatedProfile);
    
  } catch (err) {
    console.error('[PUT /api/profile/theme]', err.message);
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

// GET /api/profile/theme
router.get('/profile/theme', (req, res) => {
  try {
    const profile = readJSON(PROFILE_PATH);
 
    res.json(profile);
  } catch (error) {
    console.error('Erreur lecture profile.json :', error.message);
    res.status(500).json({ error: 'Failed to read profile data' });
  }
});


module.exports = router;