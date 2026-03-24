console.log("Server starting...");

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


// 1. `GET /api/test` → retourne un objet JSON `{ status: "ok", message: "API is working" }` avec `res.json()`

app.get('/api/test', (req, res) => {
  res.json({
    status: "ok",
    message: "API is working"
  });
});

// 2. `GET /api/hello/:name` → lit le parametre `name` depuis `req.params.name` et retourne `{ message: "Hello, [name]!" }`

app.get('/api/hello/:name', (req, res) => {
  const name = req.params.name;

  res.json({
    message: `Hello, ${name}!`
  });
});

// 3. `GET /api/links` → retourne un tableau hardcode de 3 objets link en JSON

app.get('/api/links', (req, res) => {

  const links = [
      {
        id: 1,
        name: "GitHub",
        link: "https://github.com"
      }, {
        id: 2,
        name: "LinkedIn",
        link: "https://linkedin.com"
      }, {
        id: 3,
        name: "Blog",
        link: "https://blog.com"
      }
    ];

  res.json(links);

});


// Expliquer le cycle requete-reponse : le navigateur envoie une requete HTTP GET → Express la recoit → le route handler s'execute → la reponse est renvoyee au navigateur.

// Navigateur  →  Requête (req)  →  Serveur ////// req = ce que le client demande
// Navigateur  ←  Réponse (res)  ←  Serveur ////// res = ce que le serveur renvoie

// ctrl + c = redémarre le terminal

app.use(morgan('dev'));

app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => { 
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`); 
  next(); 
});

app.use('/api', router);

// Servir les fichiers statiques depuis ../front
app.use(express.static(path.join(__dirname, '../front')));