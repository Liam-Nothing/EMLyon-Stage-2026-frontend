const express = require('express');
const path = require ('path');
const app = express();
const morgan = require('morgan');
const PORT = 3000;
 
// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../front')));
 
// Routes
const linksRouter   = require('./routes/links');
const profileRouter = require('./routes/profile');
const themesRouter  = require('./routes/themes');
 
app.use('/api', linksRouter);
app.use('/api', profileRouter);
app.use('/api/themes', themesRouter);


// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server starting...`);
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`  → GET http://localhost:${PORT}/api/links`);
  console.log(`  → GET http://localhost:${PORT}/api/profile`);
  console.log(`  → GET http://localhost:${PORT}/api/themes`);
});