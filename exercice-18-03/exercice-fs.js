// Creer un fichier JSON programmatiquement avec `fs.writeFileSync` contenant un tableau de 3 objets link : `{ "id": "1", "title": "Mon Portfolio", "url": "https://example.com" }`

const fs = require('fs'); // module pour manipuler les fichiers

const links = [
  { "id": "1", "title": "Mon Portfolio", "url": "https://example.com" },
  { "id": "2", "title": "Blog", "url": "https://blog.com" },
  { "id": "3", "title": "GitHub", "url": "https://github.com" }
];

fs.writeFileSync('links.json', JSON.stringify(links, null, 2));

console.log('Fichier links.json créé avec succès !'); // Facultatif

// Explications :

// links.json → le fichier qui sera créé (dans le même dossier que ton script)
// JSON.stringify(links, null, 2) → transforme le tableau d’objets en texte JSON lisible
// console.log → juste pour confirmer que ça a marché



// Exo 2

// Relire ce fichier avec `fs.readFileSync` et parser le contenu avec `JSON.parse` pour obtenir un tableau JavaScript exploitable

// 1️⃣ Lire le fichier JSON
const data = fs.readFileSync('links.json', 'utf8'); // 'utf8' pour obtenir une chaîne de caractères

// 2️⃣ Parser le JSON pour obtenir un tableau JS
const readLinks = JSON.parse(data);

// 3️⃣ Utiliser le tableau
console.log('Tableau de liens :', readLinks);

// === fs.readFileSync('links.json', 'utf8')
// Lit le fichier links.json
// 'utf8' = pour que le contenu soit en texte (sinon ce serait un Buffer)

// === JSON.parse(data)
// Transforme la chaîne JSON en tableau d’objets JavaScript
// Tu peux maintenant utiliser ce tableau avec toutes les fonctions JS (forEach, map, etc.)


// Exo 3 

// Ajouter un nouveau lien au tableau, puis reecrire le fichier avec `JSON.stringify(data, null, 2)` (le `null, 2` sert a indenter le JSON pour qu'il soit lisible)

const newLink = {
  id: "4",
  title: "LinkedIn",
  url: "https://linkedin.com"
};

// Ajouter le nouveau lien au tableau existant
readLinks.push(newLink);

// Réécrire le fichier JSON avec indentation (null, 2)
fs.writeFileSync('links.json', JSON.stringify(readLinks, null, 2));

console.log('Nouveau lien ajouté et fichier links.json mis à jour !');

console.log(readLinks);


// Creer deux fonctions reutilisables : `readJSON(filePath)` qui lit et parse un fichier JSON, et `writeJSON(filePath, data)` qui stringify et ecrit les donnees dans un fichier

//=======================================================================================================================
// function readJSON(filePath) {
//   // Lit et parse .json
//   //fs.readFileSync('fichier.json','utf8') pour lire
//   //JSON.parse(fs.readFileSync)

//   const data = fs.readFileSync(filePath, 'utf8');
//   return JSON.parse(data);

// }

// function writeJSON(filePath, data) {
//   // Stringify et écrit dans un fichier
//   // fs.writeFileSync('links.json', JSON.stringify(links, null, 2));
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2)) // data ici est la variable où il y a le tableau
// }
//=======================================================================================================================



// Utiliser `try/catch` pour gerer les erreurs : fichier introuvable, JSON invalide, permissions insuffisantes. Ces deux fonctions `readJSON` et `writeJSON` sont la fondation de tout le backend — toutes les donnees de l'application seront stockees dans des fichiers JSON.

try {
  // code qui peut provoquer une erreur
  console.log(readJSON('package.json'));
  console.log("Success !");
} catch (error) {
  // code qui s'exécute si une erreur survient
  console.error("Une erreur est survenue :", error.message);
}

module.exports = {
  readJSON,
  writeJSON,
  links
};