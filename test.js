#!/usr/bin/env node
const osmosis = require('osmosis');
const src = require('./src.js');

const scrapeNewsFromPanasonic = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://industrial.panasonic.com/ww/product-news?year%5Bvalue%5D%5Byear%5D=2021&product-id=429')
    .set('year', 'div.view-content > div.item-list')
    .find('dl.views-row')
    .set({
      title: 'a',
      dayAndMonth: 'dt',
      link: 'a@href',
    })
    .data((content) => {
      content.year = (new Date()).getFullYear();
      content.date = `${content.dayAndMonth}, ${content.year}`;
      result.push(src.fillUpAbsentData(content, 'Panasonic'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

scrapeNewsFromPanasonic().then(console.log);
