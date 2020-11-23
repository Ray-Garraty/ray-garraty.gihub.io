const _ = require('lodash');
const src = require('./src.js');
const osmosis = require('osmosis');

const resultFileName = 'sc.htm';
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

const websitesList = [
  scrapeNewsFromTEEMP(),      
];
  
src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);