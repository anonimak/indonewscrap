// db.js
const Path = require('path');
const glob = require('glob');
const apiFiles = glob.sync('./api/*.json', {
  nodir: true,
});

let data = {};

apiFiles.forEach((filePath) => {
  const api = require(Path.join(__dirname, filePath));
  let url = filePath.slice(0, filePath.length - 5);
  let [, file] = url.split('api/');
  data[file] = api; // the only change
});

module.exports = data;
