const _ = require('lodash');
const src = require('./src.js');
const osmosis = require('osmosis');

const resultFileName = 'sofc.htm';
const header = 'Новости ТОТЭ';

const scrapeNewsFromElcogen = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://elcogen.com/news/')
    .find('div.news-item.clearfix')
    .set({
      title: 'a',
      date: 'div.news-date',
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

const scrapeNewsFromSolidPower = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://www.solidpower.com/en/news/all-news/')
      .find('div.col-md-10')
      .set({
        title: 'a.news_link',
        date: 'time',
        link: 'a.news_link @href',
      })
      .data(function(content) {
        const domainName = 'https://www.solidpower.com/';
        content.link = content.link.includes(domainName) 
        ? content.link 
        : `${domainName}${content.link}`;
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

const scrapeNewsFromSeeO2Energy = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://www.seeo2energy.com/news-and-achievements/')
      .find('div.wpb_wrapper div.wpb_wrapper')
      .set({
        title: 'a',
        date: 'em',
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

const websitesList = [
  // scrapeNewsFromElcogen(),
  // scrapeNewsFromSolidPower(),
  scrapeNewsFromSeeO2Energy(),
];

src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);