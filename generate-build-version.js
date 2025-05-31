/* eslint-disable no-console */
const fs = require('fs');
const packageJson = require('./package.json');

const appVersion = packageJson.version;

const jsonData = {
  version: appVersion,
  timestamp: Date.now(),
};

const jsonContent = JSON.stringify(jsonData);

fs.writeFile('./public/meta.json', jsonContent, 'utf8', (err) => {
  if (err) {
    console.log('An error occurred while writing JSON Object to meta.json');
    console.log(err);
    return;
  }

  console.log(`meta.json file has been saved with latest version number, ${appVersion}`);
});
