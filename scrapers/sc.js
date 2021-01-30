#!/usr/bin/env node
const osmosis = require('osmosis');
const src = require('../app.js');

const scrapeNewsFromTEEMP = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('http://teemp.ru/news/')
    .find('div.news-item')
    .set({
      title: 'div.title.p-b-20',
      date: 'span.label',
      link: 'div.row > a@href',
    })
    .data((content) => {
      const domainName = 'http://teemp.ru';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      content.date = content.date.split('.').reverse().join('-');
      result.push(src.fillUpAbsentData(content, 'ТЭЭМП'));
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromPanasonic = () => new Promise((resolve) => {
  const currentYear = (new Date()).getFullYear();
  const result = [];
  osmosis
    .get(`https://industrial.panasonic.com/ww/product-news?year%5Bvalue%5D%5Byear%5D=${currentYear}&product-id=429`)
    .set('year', 'div.view-content > div.item-list')
    .find('dl.views-row')
    .set({
      title: 'a',
      dayAndMonth: 'dt',
      link: 'a@href',
    })
    .data((content) => {
      content.date = `${content.dayAndMonth}, ${currentYear}`;
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

const scrapeNewsFromSkeleton = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.skeletontech.com/news')
    .find('div.post-header')
    .set({
      title: 'a',
      date: 'p',
      link: 'a@href',
    })
    .data((content) => {
      const regex = /\d{1,} [A-Z]\w{3,} \d{4}/m;
      content.date = content.date.match(regex)[0];
      result.push(src.fillUpAbsentData(content, 'Skeleton'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromNAWA = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('http://www.nawatechnologies.com/en/category/actualites-en/')
    .find('div.fusion-post-content')
    .set({
      title: 'a',
      date: 'span:nth-child(4)',
      link: 'a@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'NAWA'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromTPS = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://titanps.ru/category/news/')
    .find('div.news-item')
    .set({
      title: 'p.link > a',
      date: 'p.date',
      link: 'p.link > a@href',
    })
    .data((content) => {
      const [day, month, year] = content.date.split(' ');
      content.date = `${day}${src.translateMonth(month)}${year}`;
      result.push(src.fillUpAbsentData(content, 'ТПС'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

exports.launchScrapers = () => [
  scrapeNewsFromTEEMP(),
  scrapeNewsFromPanasonic(),
  scrapeNewsFromSkeleton(),
  scrapeNewsFromNAWA(),
  scrapeNewsFromTPS(),
  src.scrapeNewsFromGoogleScholar('supercapacitor'),
  src.scrapeNewsFromGoogleScholar('lithium+ion+capacitor'),
];
