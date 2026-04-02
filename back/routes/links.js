const path = require('path');
const { readJSON, writeJSON } = require('../utils/jsonHelper.js');
const express = require('express');
const router = express.Router();
const LINKS = path.join(__dirname, '..', 'data', 'links.json');

// const link = readJSON(LINKS);


// Helper : format d'erreur uniforme
const err = (message) => ({ error: true, message });


// Validation URL 
const isValidUrl = (url) => {
  try { new URL(url); return true; }
  catch { return false; }
};


// ROUTE GET
router.get('/', (req, res) => {
  try {
    const links = readJSON(LINKS);
    res.json(links.sort((a, b) => a.order - b.order));
  } catch (e) {
    console.error('[GET /api/links]', e.message);
    res.status(500).json({ error: 'Impossible de lire les liens' });
  }
});



// ROUTE POST
router.post('/', (req, res) => {
  try {
    const { title, url, icon = '' } = req.body;
 
    if (!title || !title.trim())
      return res.status(400).json(err('Le titre est requis'));
    if (title.trim().length > 100)
      return res.status(400).json(err('Le titre ne peut pas dépasser 100 caractères'));
    if (!url || !url.trim())
      return res.status(400).json(err("L'URL est requise"));
    if (!url.startsWith('http://') && !url.startsWith('https://'))
      return res.status(400).json(err("L'URL doit commencer par http:// ou https://"));
    if (!isValidUrl(url))
      return res.status(400).json(err("L'URL n'est pas valide"));
 
    const links   = readJSON(LINKS) || [];
    const maxOrder = Math.max(0, ...links.map(l => l.order || 0));
 
    const newLink = {
      id:        Date.now().toString(),
      title:     title.trim(),
      url:       url.trim(),
      icon,
      order:     maxOrder + 1,
      active:    true,
      createdAt: new Date().toISOString(),
    };
 
    links.push(newLink);
    writeJSON(LINKS, links);
 
    res.status(201).json(newLink);
  } catch (e) {
    console.error('[POST /api/links]', e.message);
    res.status(500).json(err('Impossible de créer le lien'));
  }
});



//ROUTE PUT /:ID
router.put('/:id', (req, res) => {
   try {
    const { id }    = req.params;
    const updates   = req.body;
    const links     = readJSON(LINKS);
    const linkIndex = links.findIndex(l => l.id === id);
 
    if (linkIndex === -1)
      return res.status(404).json(err('Lien introuvable'));
 
    // Validation des champs envoyés
    if (updates.title !== undefined) {
      if (!updates.title.trim())
        return res.status(400).json(err('Le titre ne peut pas être vide'));
      if (updates.title.trim().length > 100)
        return res.status(400).json(err('Le titre ne peut pas dépasser 100 caractères'));
    }
    if (updates.url !== undefined) {
      if (!updates.url.startsWith('http://') && !updates.url.startsWith('https://'))
        return res.status(400).json(err("L'URL doit commencer par http:// ou https://"));
      if (!isValidUrl(updates.url))
        return res.status(400).json(err("L'URL n'est pas valide"));
    }
 
    const existingLink = links[linkIndex];
    const { id: _id, order: _order, createdAt: _cat, ...safeUpdates } = updates;
 
    links[linkIndex] = {
      ...existingLink,
      ...safeUpdates,
      id:        existingLink.id,
      order:     existingLink.order,
      createdAt: existingLink.createdAt,
    };
 
    writeJSON(LINKS, links);
    res.json(links[linkIndex]);
  } catch (e) {
    console.error('[PUT /api/links/:id]', e.message);
    res.status(500).json(err('Impossible de modifier le lien'));
  }
});


// DELETE /api/links/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    let links    = readJSON(LINKS);
 
    if (!links.some(l => l.id === id))
      return res.status(404).json(err('Lien introuvable'));
 
    links = links
      .filter(l => l.id !== id)
      .sort((a, b) => a.order - b.order)
      .map((l, i) => ({ ...l, order: i + 1 }));
 
    writeJSON(LINKS, links);
    res.json({ error: false, message: 'Lien supprimé' });
  } catch (e) {
    console.error('[DELETE /api/links/:id]', e.message);
    res.status(500).json(err('Impossible de supprimer le lien'));
  }
});


// ROUTE PATCH
router.patch('/reorder', (req, res) => {
  try {
    const newOrder = req.body;
 
    if (!Array.isArray(newOrder) || newOrder.length === 0)
      return res.status(400).json(err('Le body doit être un tableau non vide'));
 
    for (const item of newOrder) {
      if (!item.id || typeof item.order !== 'number')
        return res.status(400).json(err('Chaque item doit avoir un id et un order numérique'));
    }
 
    const links      = readJSON(LINKS) || [];
    const existingIds = new Set(links.map(l => l.id));
    const invalidIds  = newOrder.filter(item => !existingIds.has(item.id));
 
    if (invalidIds.length > 0)
      return res.status(400).json(err(`IDs introuvables : ${invalidIds.map(i => i.id).join(', ')}`));
 
    const orderMap = new Map(newOrder.map(item => [item.id, item.order]));
    const reordered = links
      .map(l => ({ ...l, order: orderMap.has(l.id) ? orderMap.get(l.id) : l.order }))
      .sort((a, b) => a.order - b.order);
 
    writeJSON(LINKS, reordered);
    res.json(reordered);
  } catch (e) {
    console.error('[PATCH /api/links/reorder]', e.message);
    res.status(500).json(err('Impossible de réordonner les liens'));
  }
});


module.exports = router;