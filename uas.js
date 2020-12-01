#!/usr/bin/env node

const src = require('./src.js');
const osmosis = require('osmosis');
const resultFileName = './docs/uas.htm';
const header = 'Новости БА и БЛА';

const scrapeNewsFromDroneLife = () => {
    return new Promise((resolve, reject) => {
      const result = [];
      osmosis
        .get(`https://dronelife.com/news/`)
        .find('div.entry-content li.rpwe-li')
        .set({
            title: 'h3 > a',
            date: 'time',
            link: 'h3 > a@href',
        })
        .data(function(content) {
          result.push(content);
        })
        .done(() => {
          const slicedResult = result.slice(0, 7);
          return resolve(slicedResult);
        })
        .log(console.log)
        .error(console.log)
        .debug(console.log);
      }); 
  };

  const websitesList = [
  scrapeNewsFromDroneLife(),
  src.generateNewsArrayFromRSS('https://www.unmannedsystemstechnology.com/category/news/uav-news/feed'),
  src.generateNewsArrayFromRSS('https://www.unmannedsystemstechnology.com/category/news/ugv-news/feed'),
  src.scrapeNewsFromYandexNews('%D0%B1%D0%B5%D1%81%D0%BF%D0%B8%D0%BB%D0%BE%D1%82%D0%BD%D0%B8%D0%BA%D0%B8+-%D0%B0%D1%80%D0%BC%D0%B5%D0%BD%D0%B8%D1%8F+-%D0%B0%D0%B7%D0%B5%D1%80%D0%B1%D0%B0%D0%B9%D0%B4%D0%B6%D0%B0%D0%BD+-%D0%BA%D0%B0%D1%80%D0%B0%D0%B1%D0%B0%D1%85+-%D1%81%D0%B8%D1%80%D0%B8%D1%8F+-%D1%82%D1%83%D1%80%D1%86%D0%B8%D1%8F+-%D0%B4%D0%BE%D0%BD%D0%B1%D0%B0%D1%81%D1%81+-%D1%83%D0%BA%D1%80%D0%B0%D0%B8%D0%BD%D0%B0'),
  src.scrapeNewsFromYandexNews('%D0%B1%D0%B5%D1%81%D0%BF%D0%B8%D0%BB%D0%BE%D1%82%D0%BD%D1%8B%D0%B5+%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D0%B8+-%D0%B0%D1%80%D0%BC%D0%B5%D0%BD%D0%B8%D1%8F+-%D0%B0%D0%B7%D0%B5%D1%80%D0%B1%D0%B0%D0%B9%D0%B4%D0%B6%D0%B0%D0%BD+-%D0%BA%D0%B0%D1%80%D0%B0%D0%B1%D0%B0%D1%85+-%D1%81%D0%B8%D1%80%D0%B8%D1%8F+-%D1%82%D1%83%D1%80%D1%86%D0%B8%D1%8F+-%D0%B4%D0%BE%D0%BD%D0%B1%D0%B0%D1%81%D1%81+-%D1%83%D0%BA%D1%80%D0%B0%D0%B8%D0%BD%D0%B0'),
];

src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);