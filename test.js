#!/usr/bin/env node


const https = require('https');
const axios = require('axios');
const osmosis = require('osmosis');
const proxy = require('./proxy.js');
const src = require('./src.js');
const fs = require('fs'),
    xml2js = require('xml2js');
// const getProxies = proxy.getProxiesList();

// proxiesList.then((result) => что-то делаем с массивом прокси-серверов);

// osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');

osmosis
  .get(`https://www.popmech.ru/search/?query=%D0%B1%D0%B5%D1%81%D0%BF%D0%B8%D0%BB%D0%BE%D1%82%D0%BD%D0%B8%D0%BA`)
  .delay(10000)
  //.then(context => fs.writeFileSync('debug.htm', context.toString()))
  .find('a.search-article')
  .set({
    title: 'h3',
    date: '@href',
    link: '',
  })
  .data(function(content) {
    console.log(content);
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log);
