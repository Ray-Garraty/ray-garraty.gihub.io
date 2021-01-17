#!/usr/bin/env node
const osmosis = require('osmosis');
const src = require('./src.js');

const resultFileName = './docs/sofc.htm';
const header = 'Новости ТОТЭ';

const scrapeNewsFromBloomEnergy = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.bloomenergy.com/newsroom/press-releases')
    .find('div.views-row')
    .set({
      title: 'a',
      date: 'span.date-display-single',
      link: 'a@href',
    })
    .data((content) => {
      const domainName = 'https://www.bloomenergy.com';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'Bloom Energy'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromElcogen = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://elcogen.com/news/')
    .find('div.news-item.clearfix')
    .set({
      title: 'a',
      date: 'div.news-date',
      link: 'a@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'Elcogen'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromSolidPower = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.solidpower.com/en/news/all-news/')
    .find('div.col-md-10')
    .set({
      title: 'a.news_link',
      date: 'time',
      link: 'a.news_link @href',
    })
    .data((content) => {
      const domainName = 'https://www.solidpower.com/';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'SolidPower'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromSeeO2Energy = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.seeo2energy.com/news-and-achievements/')
    .find('div.wpb_wrapper div.wpb_wrapper')
    .set({
      title: 'a',
      date: 'em',
      link: 'a@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'SeeO2Energy'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const websitesList = [
  scrapeNewsFromBloomEnergy(),
  scrapeNewsFromElcogen(),
  scrapeNewsFromSolidPower(),
  scrapeNewsFromSeeO2Energy(),
  src.scrapeNewsFromGoogleScholar('solid+oxide+fuel+cells'),
];

src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);
