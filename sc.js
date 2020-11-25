const _ = require('lodash');
const src = require('./src.js');
const osmosis = require('osmosis');

const resultFileName = './docs/sc.htm';
const header = 'Новости СК';

const scrapeNewsFromTEEMP = () => {
    return new Promise((resolve, reject) => {
      const result = [];
      osmosis
        .get('http://teemp.ru/news/')
        .find('div.news-item')
        .set({
            title: 'div.title.p-b-20',
            date: 'span.label',
            link: 'div.row > a@href',
        })
        .data(function(content) {
          const domainName = 'http://teemp.ru';
          content.link = content.link.includes(domainName) 
          ? content.link 
          : `${domainName}${content.link}`;
          content.date = content.date.split('.').reverse().join('-');
          result.push(content);
        })
        .done(() => resolve(result))
        .log(console.log)
        .error(console.log)
        .debug(console.log);
      }); 
};

const scrapeNewsFromPanasonic = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://industrial.panasonic.com/ww/product-news')
      .set('year', 'div.view-content > div.item-list')
      .find('dl.views-row')
      .set({
        title: 'a',
        dayAndMonth: 'dt',
        link: 'a@href',
      })
      .data(function(content) {
        content.year = content.year.slice(0, 4);
        content.date = `${content.dayAndMonth}, ${content.year}`;
        result.push(content);
      })
      .done(() => {
        const slicedResult = result.slice(0, 5);
        return resolve(slicedResult);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
    }); 
};

const scrapeNewsFromSkeleton = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://www.skeletontech.com/news')
      .find('div.post-header')
      .set({
        title: 'a',
        date: 'p',
        link: 'a@href',
      })
      .data(function(content) {
        const regex = /\d{1,} [A-Z]\w{3,} \d{4}/m;
        content.date = content.date.match(regex)[0];
        result.push(content);
      })
      .done(() => {
        const slicedResult = result.slice(0, 5);
        return resolve(slicedResult);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
    }); 
};

const scrapeNewsFromNAWA = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('http://www.nawatechnologies.com/en/category/actualites-en/')
      .find('div.fusion-post-content')
      .set({
        title: 'a',
        date: 'span:nth-child(4)',
        link: 'a@href',
      })
      .data(function(content) {
        result.push(content);
      })
      .done(() => {
        const slicedResult = result.slice(0, 5);
        return resolve(slicedResult);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
    }); 
};

const scrapeNewsFromTPS = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://titanps.ru/category/news/')
      .find('div.news-item')
      .set({
        title: 'p.link > a',
        date: 'p.date',
        link: 'p.link > a@href',
      })
      .data(function(content) {
        const [day, month, year] = content.date.split(' ');
        content.date = `${day}${src.translateMonth(month)}${year}`;
        result.push(content);
      })
      .done(() => {
        const slicedResult = result.slice(0, 5);
        return resolve(slicedResult);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
    }); 
};


const websitesList = [
  scrapeNewsFromTEEMP(),
  scrapeNewsFromPanasonic(),
  scrapeNewsFromSkeleton(),
  scrapeNewsFromNAWA(),
  scrapeNewsFromTPS(),
  src.scrapeNewsFromGoogleScholar('supercapacitor'),
  src.scrapeNewsFromGoogleScholar('lithium+ion+capacitor'),
];
  
src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);