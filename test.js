#!/usr/bin/env node
const axios = require('axios');
const fs = require('fs');
const src = require('./src.js');

axios
  .get('https://www.bing.com/news/search?q=%d0%b1%d0%b5%d1%81%d0%bf%d0%b8%d0%bb%d0%be%d1%82%d0%bd%d0%b8%d0%ba%d0%b8&qft=sortbydate%3d%221%22+interval%3d%228%22&form=YFNR')
  .then((response) => {
    fs.writeFileSync('test.htm', response.data, 'utf-8');
  })
  .catch(console.error);
