const express = require('express');
const path = require('path');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/jsonHelper');

const PROFILE_PATH = path.join(__dirname, '..', 'data', 'profile.json');
const THEMES_PATH  = path.join(__dirname, '..', 'data', 'themes.json');


// Helper : format d'erreur uniforme 
const err = (message) => ({ error: true, message });


// GET /PROFILE
router.get('/profile', (req, res) => {
  try {
    const profile = readJSON(PROFILE_PATH);
    res.json(profile);
  } catch (e) {
    console.error('[GET /api/profile]', e.message);
    res.status(500).json(err('Impossible de lire le profil'));
  }
});


// PUT /PROFILE
router.put('/profile', (req, res) => {
  try {
    const updates = req.body;
 
    if (!updates || typeof updates !== 'object' || Array.isArray(updates))
      return res.status(400).json(err('Le body doit être un objet JSON'));
 
    // Validation name
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || updates.name.trim().length === 0)
        return res.status(400).json(err('Le nom ne peut pas être vide'));
      if (updates.name.trim().length > 50)
        return res.status(400).json(err(`Nom trop long (${updates.name.trim().length}/50 caractères)`));
    }
 
    // Validation bio
    if (updates.bio !== undefined) {
      if (typeof updates.bio !== 'string')
        return res.status(400).json(err('La bio doit être une chaîne de caractères'));
      if (updates.bio.length > 160)
        return res.status(400).json(err(`Bio trop longue (${updates.bio.length}/160 caractères)`));
    }
 
    // Validation avatar
    if (updates.avatar !== undefined) {
      if (typeof updates.avatar !== 'string')
        return res.status(400).json(err("L'avatar doit être une chaîne de caractères"));
      const isBase64 = updates.avatar.startsWith('data:image/');
      const isURL    = updates.avatar.startsWith('http');
      const isEmpty  = updates.avatar === '';
      if (!isBase64 && !isURL && !isEmpty)
        return res.status(400).json(err("L'avatar doit être une data URI base64, une URL, ou une chaîne vide"));
    }
 
    // Validation socialLinks
    if (updates.socialLinks !== undefined) {
      if (!Array.isArray(updates.socialLinks))
        return res.status(400).json(err('socialLinks doit être un tableau'));
      for (const link of updates.socialLinks) {
        if (!link.platform || typeof link.platform !== 'string')
          return res.status(400).json(err('Chaque réseau social doit avoir un champ platform'));
        if (!link.url || typeof link.url !== 'string')
          return res.status(400).json(err('Chaque réseau social doit avoir un champ url'));
      }
    }
 
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
 
  } catch (e) {
    console.error('[PUT /api/profile]', e.message);
    res.status(500).json(err('Impossible de mettre à jour le profil'));
  }
});


// PUT /PROFILE/THEME
router.put('/profile/theme', (req, res) => {
  try {
    const { themeId } = req.body;
 
    if (!themeId || typeof themeId !== 'string' || !themeId.trim())
      return res.status(400).json(err('themeId est requis'));
 
    const themes = readJSON(THEMES_PATH);
    const theme  = themes.find(t => t.id === themeId.trim());
 
    if (!theme)
      return res.status(404).json(err(`Thème "${themeId}" introuvable`));
 
    const currentProfile = readJSON(PROFILE_PATH);
    const updatedProfile = {
      ...currentProfile,
      theme:  theme.id,
      colors: { ...theme.colors },
    };
 
    writeJSON(PROFILE_PATH, updatedProfile);
    res.json(updatedProfile);
 
  } catch (e) {
    console.error('[PUT /api/profile/theme]', e.message);
    res.status(500).json(err('Impossible de changer le thème'));
  }
});


// GET /PROFILE/THEME
router.get('/profile/theme', (req, res) => {
   try {
    const profile = readJSON(PROFILE_PATH);
    res.json({ theme: profile.theme, colors: profile.colors });
  } catch (e) {
    console.error('[GET /api/profile/theme]', e.message);
    res.status(500).json(err('Impossible de lire le thème'));
  }
});


module.exports = router;