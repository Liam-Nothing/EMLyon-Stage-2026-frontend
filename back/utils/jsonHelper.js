const fs = require('fs');
const path = require('path')

function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
}

module.exports.readJSON = readJSON;

if (require.main === module) {
  console.log("=== TEST 1: fichier valide ===");
  console.log(readJSON('../data/links.json'));

  console.log("\n=== TEST 2: fichier valide ===");
  console.log(readJSON('../data/profile.json'));

  console.log("\n=== TEST 3: fichier inexistant ===");
  console.log(readJSON('../profile.json'));
}


function writeJSON(filePath, data) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

    if (fs.existsSync(filePath)) {
        const backupPath = filePath + '.bak';
        fs.copyFileSync(filePath, backupPath);
        console.log(`Backup created: ${backupPath}`);
    }

    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf-8');
    console.log(`File written successfully: ${filePath}`);
    } catch (err) {
        console.error(`Error writing JSON to ${filePath}:` , err.message);
    }
}


module.exports.writeJSON = writeJSON;






