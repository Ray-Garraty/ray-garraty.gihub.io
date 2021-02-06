#!/usr/bin/env node
const osmosis = require('osmosis');
const LanguageDetect = require('languagedetect');
const src = require('./app.js');

const lngDetector = new LanguageDetect();
const scrapeNewsFromPermascand = () => new Promise((resolve) => {
  const result = [];
  return osmosis
    .get('https://permascand.com/contact/news/')
    .find('article')
    .set({
      title: 'h2 > a',
      date: 'span.published',
      link: 'a@href',
    })
    .data((content) => {
      const [[lang]] = lngDetector.detect(content.title, 1);
      result.push(src.fillUpAbsentData({ ...content, lang }, 'H2Live'));
    })
    .done(() => resolve(result.filter((post) => post.lang === 'english')))
    .log(console.log)
    .error(console.error)
    .debug(console.log);
});

scrapeNewsFromPermascand().then(console.log);
