#!/usr/bin/env node
const fs = require('fs');
const express = require('express');
const src = require('./app.js');
const sc = require('./scrapers/sc.js');
const lib = require('./scrapers/lib.js');
const uas = require('./scrapers/uas.js');
const sofc = require('./scrapers/sofc.js');
const pemfc = require('./scrapers/pemfc.js');

const app = express();

app.get('/*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const topicName = req.url.slice(1);
  if (topicName === 'test') {
    const fakeResponseData = fs.readFileSync('_fixtures_/response.data', 'utf-8').trim();
    const parsedFakeResponseData = JSON.parse(fakeResponseData);
    parsedFakeResponseData.forEach((item) => {
      item.date = src.formatDate(item.date);
    });
    res.send(JSON.stringify(parsedFakeResponseData)).end();
  } else {
    try {
      let promises;
      switch (topicName) {
        case 'sofc':
          promises = sofc.launchScrapers();
          break;
        case 'pemfc':
          promises = pemfc.launchScrapers();
          break;
        case 'sc':
          promises = sc.launchScrapers();
          break;
        case 'lib':
          promises = lib.launchScrapers();
          break;
        case 'uas':
          promises = uas.launchScrapers();
          break;
        default:
          throw new Error('Unknown topic name: ', topicName);
      }
      src.generateNewsArray(promises)
        .then((result) => {
          res.send(JSON.stringify(result)).end();
        });
    } catch (error) {
      res.status(404).end();
    }
  }
});
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
