#!/usr/bin/env node

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
        const month = dateArray[1].match(/\W{3,}/);
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

const scrapeNewsFromLeclanche = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get('https://www.leclanche.com/company-news/')
      .find('article')
      .set({
        title: 'a',
        date: 'time.entry-date.published',
        link: 'a@href',
      })
      .data(function(content) {
        content.date = content.date.replace(/(st)|(rd)|(th)|(nd)/g, '');
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

const scrapeNewsFromMiningDotCom = (inquiry) => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get(`https://www.mining.com/?s=${inquiry}`)
      .find('div.inner-content')
      .set({
        title: 'h2 > a',
        date: 'div.post-meta',
        link: 'h2 > a@href',
      })
      .data(function(content) {
        content.date = content.date.split('|')[1].toString().trim();
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
  /* scrapeNewsFromHSE(),
  scrapeNewsFromSaft(),
  scrapeNewsFromLiotech(),
  scrapeNewsFromLeclanche(),
  scrapeNewsFromMiningDotCom('lithium'),
  scrapeNewsFromMiningDotCom('cobalt'), */
  src.scrapeNewsFromYandexNews('%D0%BB%D0%B8%D1%82%D0%B8%D0%B9-%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5+%D0%B0%D0%BA%D0%BA%D1%83%D0%BC%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%D1%8B'),
];
  
src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);