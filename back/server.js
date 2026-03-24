const express = require('express');
const app = express();
const PORT = 3000;
 
// Middleware
app.use(express.json());
 
// Routes
const linksRouter   = require('./routes/links');
const profileRouter = require('./routes/profile');
 
app.use('/api', linksRouter);
app.use('/api', profileRouter);
 
// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server starting...`);
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`  → GET http://localhost:${PORT}/api/links`);
  console.log(`  → GET http://localhost:${PORT}/api/profile`);
});