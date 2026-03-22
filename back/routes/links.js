const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

// read links.json
function readJSON(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(data);

  return json.sort((a, b) => a.order - b.order);
}
const link = readJSON('../data/links.json');


app.get('/api/links', (req, res) => {
  res.json(link);
});

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../front')));



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