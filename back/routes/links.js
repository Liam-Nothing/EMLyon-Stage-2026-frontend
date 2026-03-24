const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const { readJSON, writeJSON } = require('../utils/jsonHelper.js');

const app = express();
const LINKS = path.join(__dirname, 'data', 'links.json');


// ─── Middlewares ───────────────────────────────────────────
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../front')));


// ─── Router ───────────────────────────────────────────
const router = express.Router();



// read links.json
// function readJSON(filePath) {
//   const data = fs.readFileSync(filePath, 'utf8');
//   const json = JSON.parse(data);

//   return json.sort((a, b) => a.order - b.order);
// }
const link = readJSON('../data/links.json');


app.get('/api/links', (req, res) => {
  res.json(link);
});



app.get("api/links", (req, res) => {
  const filePath = path.join(__dirname, "../data/links.json");

  try {
    // Vérifie si le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    // Lecture du fichier
    const data = fs.readFileSync(filePath, "utf-8");

    // Parsing JSON (peut échouer si corrompu)
    const links = JSON.parse(data);

    res.json(links);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to read links data"
    });
  }
});


// Si on utilise un fichier router separe, utiliser `express.Router()` dans `links.js`, definir les routes dessus, l'exporter, puis dans `server.js` faire `app.use('/api', linksRouter)`



// ROUTE POST
app.post("/api/links", (req, res) => {
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
});



//ROUTE PUT
router.put('/links/:id', (req, res) => {
  const {id} = req.params;
  const links = readJSON(LINKS);
  const linkIndex = links.findIndex(link => link.id ===id);

  if (linkIndex === -1) {
    return res.status(404).json({ error : 'link not found'});
  }

  const existingLink = links[linkIndex];
  
  const updatedLink = {
    ...existingLink,
    ...req.body,
    id:         existingLink.id,
    order:      existingLink.order,
    createdAt:  existingLink.createdAt,
  };

  links[linkIndex] = updatedLink;
  writeJSON(LINKS, links);

  res.status(200).json(updatedLink);

});


// DELETE /api/links/:id
router.delete('/links/:id', (req, res) => {
  const { id } = req.params;
  const links = readJSON(LINKS);
  
  // Vérifie si le lien existe
  const linkExists = links.some(link => link.id === id);

  if (!linkExists) {
    return res.status(404).json({error: 'link not found'});
  }

  //Suppression du lien
  link = links.filter(link => link.id !== id);

  //Recalculer l'order pour éviter les trous
  links = links.map((link, index) => ({
    ...link,
    order: index + 1
  }));

  writeJSON(filePath, links);

  res.status(200).json({ message: 'link deleted'});

});




// ROUTE PATCH

app.patch("/api/links/reorder", (req, res) => {
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
});



app.listen(3000, () => console.log("Server running on http://localhost:3000"));