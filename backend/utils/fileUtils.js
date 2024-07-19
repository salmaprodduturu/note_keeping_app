const fs = require('fs');

exports.readFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

exports.writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
