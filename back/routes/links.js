const fs = require('fs');
const express = require('express');
const app = express();

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

