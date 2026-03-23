const { readJSON, writeJSON, links } = require('./exercice-fs');

console.log(readJSON('package.json'));
console.log(links);
console.log('Success !');


// Expliquer brievement les ES Modules (`export` / `import`) et dans quels cas on les utilise (quand on met `"type": "module"` dans package.json, ou avec des fichiers `.mjs`). Pour le projet, on utilisera CommonJS car c'est le standard par defaut et le plus repandu dans les projets Express.

//CommonJS permet de diviser ton code en fichiers et de réutiliser des fonctions, objets ou classes entre fichiers.
//ES Modules : Utilisé dans les projets modernes ou quand on veut du code modulaire clair et standard, Quand tu veux charger des modules de façon asynchrone
//En JavaScript, un module asynchrone est un module dont le chargement ou l’exécution peut se faire de façon non bloquante, c’est-à-dire sans bloquer le reste du code pendant qu’il est importé.
//Un module synchrone peut etre avantageux si tu sais que tu auras besoin du module dès le début.
//CommonJS est que synchrone tandis que ES Module peut etre synchrone et asynchrone


// Ce pattern de modules sera utilise dans tout le code backend : chaque fichier de routes importera les utilitaires et les donnees dont il a besoin.