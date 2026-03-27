const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const { readJSON, writeJSON } = require('../utils/jsonHelper.js');

const app = express();
const LINKS = path.join(__dirname, '..', 'data', 'links.json');


// // ─── Middlewares ───────────────────────────────────────────
// app.use(express.json());
// app.use(morgan('dev'));
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '../front')));


// ─── Router ───────────────────────────────────────────
const router = express.Router();


const link = readJSON(LINKS);


// router.get('/', (req, res) => {
//   res.json(link);
// });



// router.get('/', (req, res) => {
//   try {
//     // Vérifie si le fichier existe
//     if (!fs.existsSync(LINKS)) {
//       throw new Error("File not found");
//     }

//     // Lecture du fichier
//     const data = fs.readFileSync(LINKS, "utf-8");

//     // Parsing JSON (peut échouer si corrompu)
//     const links = JSON.parse(data);

//     res.json(links);
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       error: "Failed to read links data"
//     });
//   }

// });

router.get('/', (req, res) => {
  try {
    const links = readJSON(LINKS);
    res.json(links.sort((a, b) => a.order - b.order));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read links data' });
  }
});



// ROUTE POST
router.post('/', (req, res, next) => {
  const { title, url, icon } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }

  // Lire les données
  let links = readJSON(LINKS) || [];

  // Générer les champs
  const id = Date.now().toString();
  const maxOrder = Math.max(0, ...links.map(link => link.order || 0));

  const newLink = {
    id,
    title,
    url,
    icon,
    order: maxOrder + 1,
    active: true,
    createdAt: new Date().toISOString()
  };

  // Ajouter
  links.push(newLink);

  // Sauvegarder
  writeJSON(LINKS, links);

  // Réponse
  res.status(201).json(newLink);

  next();
});



//ROUTE PUT
router.put('/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const links = readJSON(LINKS);
    const linkIndex = links.findIndex(link => link.id ===id);

    if (linkIndex === -1) {
      return res.status(404).json({ error : 'link not found'});
    }

    const existingLink = links[linkIndex];
  
    const updatedLink = {
      ...existingLink,
      ...updates,
      id:         existingLink.id,
      order:      existingLink.order,
      createdAt:  existingLink.createdAt,
    };

    links[linkIndex] = updatedLink;
    writeJSON(LINKS, links);

    res.status(200).json(updatedLink);
  } catch {
    res.status(500).json({ error : "Server error" });
  }

  next();

});


// DELETE /api/links/:id
router.delete('/:id', (req, res, next) => {
  try {
    const id  = req.params.id;
    let links = readJSON(LINKS);
  
    // Vérifie si le lien existe
    const linkExists = links.some(link => link.id === id);

    if (!linkExists) {
      return res.status(404).json({error: 'link not found'});
    }

    //Suppression du lien
    links = links.filter(link => link.id !== id);

    //Recalculer l'order pour éviter les trous
    links = links.map((link, index) => ({
      ...link,
      order: index + 1
    }));

    writeJSON(LINKS, links);

    res.status(200).json({ message: 'link deleted'});
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }

    next();
  });




// ROUTE PATCH

router.patch('/reorder', (req, res, next) => {
  const newOrder = req.body;

  // Vérifier que c'est un tableau
  if (!Array.isArray(newOrder)) {
    return res.status(400).json({ error: "Request body must be an array" });
  }

  // Lire les liens existants
  const links = readJSON(LINKS) || [];

  // Vérifier que tous les IDs existent
  for (const item of newOrder) {
    const link = links.find(l => l.id === item.id);
    if (!link) {
      return res.status(400).json({ error: `Link ID not found: ${item.id}` });
    }
  }

  // Mettre à jour l'ordre
  for (const item of newOrder) {
    const link = links.find(l => l.id === item.id);
    link.order = item.order;
  }

  // Trier les liens par ordre
  links.sort((a, b) => a.order - b.order);

  // Sauvegarder dans le fichier JSON
  writeJSON(LINKS, links);

  // Retourner le tableau mis à jour
  res.status(200).json(links);

  next();
});



// app.listen(3000, () => console.log("Server running on http://localhost:3000"));
module.exports = router;