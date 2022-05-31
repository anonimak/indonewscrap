// db.js
const Path = require('path');
const glob = require('glob');
const apiFiles = glob.sync('./api/*.json', {
  nodir: true,
});

let data = {};

apiFiles.forEach((filePath) => {
  let [, file] = filePath.split('api/');
  const api = require(Path.join(__dirname, file));
  let url = file.slice(0, file.length - 5);
  data[url] = api; // the only change
});

module.exports = data;
