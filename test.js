#!/usr/bin/env node
const axios = require('axios');

axios
  .get('https://ray-garraty-webscraper.ew.r.appspot.com/')
  .then((response) => console.log(response.data))
  .catch((error) => console.log(error.response.status));
