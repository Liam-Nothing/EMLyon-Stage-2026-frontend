const express = require('express');
const morgan = require('morgan');
const path = require ('path');
const app = express();
const PORT = 3000;
const frontDir = path.join(__dirname, '..', 'front');
 
// Middleware
app.use(express.json());
app.use(morgan('dev'));
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '../front')));
app.use(express.static(frontDir));
 
// Routes API
const linksRouter   = require('./routes/links');
const profileRouter = require('./routes/profile');
const themesRouter  = require('./routes/themes');
 
app.use('/api/links', linksRouter);
app.use('/api', profileRouter);
app.use('/api/themes', themesRouter);



// Route /admin 
app.get('/admin', (req, res) => {
  res.sendFile('admin/admin.html', { root: frontDir });
});



// Fallback 
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: frontDir });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`  → Profil public : http://localhost:${PORT}`);
  console.log(`  → Admin         : http://localhost:${PORT}/admin`);
  console.log(`  → API links     : http://localhost:${PORT}/api/links`);
  console.log(`  → API profile   : http://localhost:${PORT}/api/profile`);
  console.log(`  → API themes    : http://localhost:${PORT}/api/themes`);
});