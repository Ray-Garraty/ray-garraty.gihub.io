const _ = require('lodash');
const src = require('./src.js');
const osmosis = require('osmosis');

const resultFileName = './docs/lib.htm';
const header = 'Новости ЛИА';

const scrapeNewsFromHSE = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://energy.hse.ru/accenergy')
      .find('div.with-indent5._builder.builder--text')
      .set({
        title: 'em',
        date: 'p > span:nth-child(2)',
        link: 'a@href',
      })
      .data(function(content) {
        const regex = /\s|,\s/;
        if (content.date) {
          const array = content.date.split(regex);
          const [m, y] = array;
          const month = m.slice(1);
          const year = y.slice(0, -1);
          content.date = `01 ${src.translateMonth(month)} ${year}`;
        }
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

const scrapeNewsFromSaft = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://www.saftbatteries.com/media-resources/press-releases')
      .find('li.content-list-item')
      .set({
        title: 'h4',
        date: 'span.date-display-single',
        link: 'a@href',
      })
      .data(function(content) {
        const domainName = 'https://www.saftbatteries.com';
        content.link = content.link.includes(domainName) 
        ? content.link 
        : `${domainName}${content.link}`;
        content.date = content.date.split('/').reverse().join('/');
        result.push(content);
      })
      .done(() => resolve(result))
      .log(console.log)
      .error(console.log)
      .debug(console.log);
    }); 
};

const scrapeNewsFromLiotech = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://www.liotech.ru/media/')
      .find('div.news-block')
      .set({
        title: 'div.news-block__title',
        date: 'div.news-block__date',
        link: '@data-href',
      })
      .data(function(content) {
        const domainName = 'https://www.liotech.ru';
        content.link = content.link.includes(domainName) 
        ? content.link 
        : `${domainName}${content.link}`;
        const dateArray = content.date.split(' ').slice(0, 2);
        const day = dateArray[0];
        const month = dateArray[1].substr(-4);
        const year = dateArray[1].substr(-4);
        content.date = `${day} ${src.translateMonth(month)} ${year}`;
        result.push(content);
      })
      .done(() => resolve(result))
      .log(console.log)
      .error(console.log)
      .debug(console.log);
    }); 
};

const websitesList = [
  scrapeNewsFromHSE(),
  scrapeNewsFromSaft(),
  scrapeNewsFromLiotech(),
];
  
src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);