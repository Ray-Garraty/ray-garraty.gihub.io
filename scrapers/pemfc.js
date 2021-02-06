#!/usr/bin/env node
/* eslint-disable no-param-reassign */
const _ = require('lodash');
const osmosis = require('osmosis');
const LanguageDetect = require('languagedetect');
const src = require('../app.js');

const lngDetector = new LanguageDetect();

const scrapeNewsFromFuelCellsWorks = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://fuelcellsworks.com/news/')
    .paginate('a.page-numbers', 10)
    .find('.article-content-wrap')
    .set({
      title: 'h2',
      date: '.desktop-reading',
      link: 'h2 > a@href',
    })
    .data((content) => {
      content.date = content.date.split('|')[0].toString();
      result.push(src.fillUpAbsentData(content, 'FuelCellsWorks'));
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromPowerCell = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.powercell.se/en/newsroom/press-releases/')
    .find('div#releaseArchive li')
    .set({
      title: 'a',
      date: 'span.meta',
      link: 'a@href',
    })
    .data((content) => {
      content.date = content.date.split('•')[0].toString().trim();
      result.push(src.fillUpAbsentData(content, 'PowerCell'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromBallard = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.ballard.com/about-ballard/newsroom/news-releases')
    .find('ul.news-release li')
    .set({
      title: 'a',
      date: 'span.date',
      link: 'a@href',
    })
    .data((content) => {
      const domainName = 'https://www.ballard.com/about-ballard/newsroom/';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'Ballard'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromNuvera = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.nuvera.com/blog/topic/press-releases')
    .find('div.act-blog-post-listing-full-item')
    .set({
      title: 'a',
      date: 'span.act-blog-post-published-on',
      link: 'a@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'Nuvera'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromIntelligentEnergy = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.intelligent-energy.com/news-and-events/company-news/')
    .find('div.article-list header')
    .set({
      title: 'a',
      date: 'p.date',
      link: 'a@href',
    })
    .data((content) => {
      content.date = `${content.date.slice(17)}`;
      const domainName = 'https://www.intelligent-energy.com';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'Intelligent Energy'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromProtonMotor = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.proton-motor.de/gb/news/press/')
    .find('div.col-sm-6.newstext')
    .set({
      title: 'h1',
      link: 'a@href',
    })
    .follow('a@href')
    .set({
      date: 'p.float-text',
    })
    .data((content) => {
      content.date = content.date.slice(0, 10).split('/').reverse().join('/');
      result.push(src.fillUpAbsentData(content, 'Proton Motor'));
    })
    .done(() => resolve(result.sort((a, b) => a.date - b.date)))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromBMPower = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('http://bmpower.ru/news')
    .find('div.item')
    .set({
      title: 'a',
      date: 'div.dte',
      link: 'a@href',
    })
    .data((content) => {
      content.date = content.date.split(',')[0].toString().split('.').reverse().join('/');
      result.push(src.fillUpAbsentData(content, 'BMPower'));
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromElringKlinger = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.elringklinger.de/en/press/press-releases')
    .find('div.view-content div.section--region')
    .set({
      title: 'h3',
      date: 'span.date-display-single',
      link: 'a@href',
    })
    .data((content) => {
      content.date = content.date.split('-')[0].toString().trim();
      const domainName = 'https://www.elringklinger.de';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'ElringKlinger'));
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromMyFC = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.myfc.se/investor-relations/archives/news?setLang=en')
    .find('div.prm-archive-text')
    .set({
      title: 'h4',
      date: 'div.typography-small-body',
      link: 'a@href',
    })
    .data((content) => {
      const domainName = 'https://www.myfc.se';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'My FC'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromHelbio = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://helbio.com/news/')
    .find('article')
    .set({
      title: 'h2',
      day: 'span.fusion-date',
      monthAndYear: 'span.fusion-month-year',
      link: 'a@href',
    })
    .data((content) => {
      content.date = (`${content.day.padStart(2, 0)}, ${content.monthAndYear}`).split(', ').reverse().join('/'),
      result.push(src.fillUpAbsentData(content, 'Helbio'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromKeyYou = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.keyou.de/news/?lang=en')
    .find('div.site-inner article')
    .set({
      title: 'a.entry-title-link',
      date: 'time',
      link: 'a.entry-title-link@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'KeyYou'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromPlugPower = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.plugpower.com/in_the_news/')
    .find('article')
    .set({
      title: 'h4 > a',
      date: 'span.date',
      link: 'h4 > a@href',
    })
    .data((content) => {
      const regex = /[A-Z]\w{5,} \d{1,}, \d{4}/m;
      content.date = content.date.match(regex);
      result.push(src.fillUpAbsentData(content, 'PlugPower'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromHorizonFuelCells = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.horizonfuelcell.com/mediacoverage')
    .find('section')
    .set({
      title: 'h2',
      date: 'p.font_8 > span > span > span',
      link: 'h2 span a@href',
    })
    .data((content) => {
      const regex = /[A-Z]\w{5,} \d{1,}, \d{4}/m;
      if (content.date.match(regex)) {
        content.date = content.date.match(regex)[0];
      } else {
        content.date = (new Date()).toLocaleDateString('ru-RU');
      }
      result.push(src.fillUpAbsentData(content, 'Horizon Fuel Cells'));
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromSerEnergy = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.serenergy.com/news/')
    .find('div.fusion-post-wrapper')
    .set({
      title: 'a',
      date: 'p.fusion-single-line-meta > span + span + span',
      link: 'a@href',
    })
    .data((content) => {
      content.date = content.date.replace(/(st)|(rd)|(th)|(nd)/g, '');
      result.push(src.fillUpAbsentData(content, 'SerEnergy'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromAdventEnergy = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.advent.energy/news-press-releases/')
    .find('div.row.row-collapse')
    .set({
      title: 'p',
      date: 'h3',
      link: 'a@href',
    })
    .data((content) => {
      content.date = content.date.replace(/(rd)|(th)|(nd)/g, '');
      content.title = content.title.replace('Read more…', '');
      result.push(src.fillUpAbsentData(content, 'AdventEnergy'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromSFC = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.sfc.com/en/news/')
    .find('article')
    .set({
      title: 'h2 > a',
      date: 'p.meta',
      link: 'a@href',
    })
    .data((content) => {
      content.date = content.date.split(',')[0].toString();
      result.push(src.fillUpAbsentData(content, 'SFC'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromGenCellEnergy = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.gencellenergy.com/news/')
    .find('a.post-box')
    .set({
      title: 'h3',
      date: 'strong',
      link: '@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'GenCell Energy'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromBlueWorldTechnologies = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.blue.world/news')
    .find('article')
    .set({
      title: 'h2 > a',
      date: 'span.blog-date',
      link: 'h2 > a@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'BlueWorld'));
    })
    .done(() => {
      const filteredResult = _.uniqWith(result, _.isEqual);
      const slicedResult = filteredResult.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromDanaInc = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.dana.com/newsroom/press-releases/')
    .find('div.banner-medium-top')
    .set({
      title: 'a.text-dark-blue',
      date: 'p.date',
      link: 'a.text-dark-blue @href',
    })
    .data((content) => {
      content.link = `https://www.dana.com${content.link}`,
      result.push(src.fillUpAbsentData(content, 'Dana Inc'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromDoeFuelCellsOffice = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.energy.gov/eere/fuelcells/listings/hydrogen-and-fuel-cells-news')
    .find('div.node > div.content')
    .set({
      title: 'a.title-link',
      date: 'div.date',
      link: 'a.title-link @href',
    })
    .data((content) => {
      const domainName = 'https://www.energy.gov';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'DOE, Fuel Cells Office'));
    })
    .done(() => {
      const filteredResult = _.uniqWith(result, _.isEqual);
      const slicedResult = filteredResult.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromDoeFossilEnergyOffice = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.energy.gov/fe/listings/fe-press-releases-and-techlines')
    .find('div.node-article')
    .set({
      title: 'a.title-link',
      date: 'div.date',
      link: 'a.title-link @href',
    })
    .data((content) => {
      const domainName = 'https://www.energy.gov';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'DOE, Fossil Energy Office'));
    })
    .done(() => {
      const filteredResult = _.uniqWith(result, _.isEqual);
      const slicedResult = filteredResult.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromPACE = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('http://www.pace-energy.eu/news-events/')
    .find('article')
    .set({
      title: 'h2 > a',
      date: 'div.fusion-alignleft > span:nth-child(4)',
      link: 'h2 > a@href',
    })
    .data((content) => {
      content.date = content.date.replace(/(rd)|(th)|(nd)/g, '');
      result.push(src.fillUpAbsentData(content, 'PACE'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromDoosan = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('http://www.doosanmobility.com/en/about-us/news-events/')
    .find('li.m12-col-3')
    .set({
      title: 'h3',
      date: 'p.date',
      link: 'a@href',
    })
    .data((content) => {
      result.push(src.fillUpAbsentData(content, 'Doosan'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromToshiba = () => new Promise((resolve) => {
  const result = [];
  osmosis
    .get('https://www.toshiba-energy.com/en/info/index.htm')
    .find('div.newstxt')
    .set({
      title: 'h2',
      date: 'span.data.f12',
      link: 'a@href',
    })
    .data((content) => {
      const domainName = 'https://www.toshiba-energy.com';
      content.link = content.link.includes(domainName)
        ? content.link
        : `${domainName}${content.link}`;
      result.push(src.fillUpAbsentData(content, 'Toshiba'));
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
});

const scrapeNewsFromH2Live = () => new Promise((resolve) => {
  const result = [];
  return osmosis
    .get('https://h2.live/en/news')
    .find('div.CardList__Item')
    .set({
      title: 'div.Card__Headline',
      date: 'div.Card__Badge',
      link: 'a@href',
    })
    .data((content) => {
      content.link = `https://h2.live${content.link}`;
      result.push(src.fillUpAbsentData(content, 'H2Live'));
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.error)
    .debug(console.log);
});

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

exports.launchScrapers = () => [
  scrapeNewsFromFuelCellsWorks(),
  scrapeNewsFromPowerCell(),
  scrapeNewsFromBallard(),
  scrapeNewsFromNuvera(),
  scrapeNewsFromIntelligentEnergy(),
  scrapeNewsFromProtonMotor(),
  scrapeNewsFromBMPower(),
  scrapeNewsFromElringKlinger(),
  scrapeNewsFromMyFC(),
  scrapeNewsFromHelbio(),
  scrapeNewsFromKeyYou(),
  scrapeNewsFromPlugPower(),
  scrapeNewsFromHorizonFuelCells(),
  scrapeNewsFromSerEnergy(),
  scrapeNewsFromAdventEnergy(),
  scrapeNewsFromSFC(),
  scrapeNewsFromGenCellEnergy(),
  scrapeNewsFromBlueWorldTechnologies(),
  scrapeNewsFromDanaInc(),
  scrapeNewsFromDoeFuelCellsOffice(),
  scrapeNewsFromDoeFossilEnergyOffice(),
  scrapeNewsFromPACE(),
  scrapeNewsFromDoosan(),
  scrapeNewsFromToshiba(),
  scrapeNewsFromH2Live(),
  scrapeNewsFromPermascand(),
  src.extractNewsFromRSSFeed('https://www.sciencedaily.com/rss/matter_energy/fuel_cells.xml'),
  src.extractNewsFromRSSFeed('https://www.sciencedaily.com/rss/earth_climate/renewable_energy.xml'),
  src.extractNewsFromRSSFeed('https://www.sciencedaily.com/rss/matter_energy/alternative_fuels.xml'),
  src.extractNewsFromRSSFeed('https://investor.fce.com/rss/PressRelease.aspx?CategoryWorkflowId=1cb807d2-208f-4bc3-9133-6a9ad45ac3b0'),
  src.scrapeNewsFromGoogleScholar('pemfc'),
  src.scrapeNewsFromGoogleScholar('natural+gas+reforming'),
  src.scrapeNewsFromGoogleScholar('hydrogen+storage'),
  src.scrapeNewsFromGoogleScholar('hydrogen+purification'),
];
