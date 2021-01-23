#!/usr/bin/env node
const osmosis = require('osmosis');
const src = require('./src.js');

const resultFileName = './docs/lib.htm';
const header = 'Новости ЛИА';

const scrapeNewsFromHSE = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://energy.hse.ru/accenergy')
    .find('div.with-indent5._builder.builder--text')
    .set({
      title: 'em',
      date: 'p > span:nth-child(2)',
      link: 'a@href',
    })
    .data((content) => {
      const regex = /\s|,\s/;
      if (content.date) {
        const array = content.date.split(regex);
        const [m, y] = array;
        const month = m.slice(1);
        const year = y.slice(0, -1);
        content.date = `01 ${src.translateMonth(month)} ${year}`;
      }
      result.push(src.fillUpAbsentData(content, 'HSE'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromSaft = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.saftbatteries.com/media-resources/press-releases')
    .find('li.content-list-item')
    .set({
      title: 'h4',
      date: 'span.date-display-single',
      link: 'a@href',
    })
    .data((content) => {
      const domainName = 'https://www.saftbatteries.com';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      content.date = content.date.split('/').reverse().join('/');
      result.push(src.fillUpAbsentData(content, 'SAFT'));
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromLiotech = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.liotech.ru/media/')
    .find('div.news-block')
    .set({
      title: 'div.news-block__title',
      date: 'div.news-block__date',
      link: '@data-href',
    })
    .data((content) => {
      const domainName = 'https://www.liotech.ru';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      const dateArray = content.date.split(' ').slice(0, 2);
      const day = dateArray[0];
      const month = dateArray[1].match(/\W{3,}/);
      const year = dateArray[1].substr(-4);
      content.date = `${day} ${src.translateMonth(month)} ${year}`;
      result.push(src.fillUpAbsentData(content, 'Лиотех'));
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromLeclanche = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.leclanche.com/company-news/')
    .find('div.blogs__item')
    .set({
      title: 'a',
      date: 'div.blog__meta p',
      link: 'a@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'Leclanche'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromMiningDotCom = (inquiry) => new Promise((resolve) => {
  const result = [];
  osmosis
    .get(`https://www.mining.com/?s=${inquiry}`)
    .find('div.inner-content')
    .set({
      title: 'h2 > a',
      date: 'div.post-meta',
      link: 'h2 > a@href',
    })
    .data((content) => {
      content.date = content.date.split('|')[1].toString().trim();
      result.push(src.fillUpAbsentData(content, 'Mining.com'));
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
  scrapeNewsFromHSE(),
  scrapeNewsFromSaft(),
  scrapeNewsFromLiotech(),
  scrapeNewsFromLeclanche(),
  scrapeNewsFromMiningDotCom('lithium'),
  scrapeNewsFromMiningDotCom('cobalt'),
  src.generateNewsArrayFromRSS('https://www.sciencedaily.com/rss/matter_energy/batteries.xml'),
  src.scrapeNewsFromYandexNews('%D0%BB%D0%B8%D1%82%D0%B8%D0%B9-%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5+%D0%B0%D0%BA%D0%BA%D1%83%D0%BC%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%D1%8B'),
];

src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);
