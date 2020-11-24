const _ = require('lodash');
const src = require('./src.js');
const osmosis = require('osmosis');

const resultFileName = 'lib.htm';
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
        const array = content.date.split(' ');
        const [m, y] = array;
        console.log(array, 'Месяц: ', m, 'Год: ', y);
        const month = m.slice(1);
        const year = y.slice(0, -1);
        content.date = `01 ${src.translateMonth(month)} ${year}`;
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
  scrapeNewsFromHSE(),
];
  
src.generateNewsArray(websitesList)
  .then((newsArray) => src.createHtml(newsArray, header))
  .then((html) => src.writeHtmlToFile(html, resultFileName))
  .catch(console.error);