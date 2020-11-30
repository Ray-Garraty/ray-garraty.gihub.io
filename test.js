#!/usr/bin/env node

// адрес для скачивания списка прокси-серверов:
// https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all

const osmosis = require('osmosis');
const proxy = require('./proxy.js');
const src = require('./src.js');
const fs = require('fs'),
    xml2js = require('xml2js');
// const getProxies = proxy.getProxiesList();

// proxiesList.then((result) => что-то делаем с массивом прокси-серверов);

// osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');

const parser = new xml2js.Parser();
fs.readFile('./feeds/batteries.xml', function(err, data) {
  parser.parseString(data, function (err, result) {
    console.dir(result.rss.channel[0].item);
  });
});

const queryString = '%D0%BB%D0%B8%D1%82%D0%B8%D0%B9-%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5+%D0%B0%D0%BA%D0%BA%D1%83%D0%BC%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%D1%8B';
let proxiesList;
/* getProxies.then(result => {
  proxiesList = [...result];
}); */

// proxiesList = proxy.readProxiesListFromFile('http_proxies.txt');

/* osmosis
  .get(`https://newssearch.yandex.ru/yandsearch?text=${queryString}&rpt=nnews2&grhow=clutop&wiz_no_news=1&rel=tm`)
  .config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
  .config('tries', 1)
  .config('concurrency', 1)
  //.config('proxy', choseRandomProxyFromList(proxiesList))
  .delay(2000)
  .paginate('div.pager__content :nth-child(3) > a', 3)
  .delay(2000)
  //.find('div.documents :first-child')
  .find('li.search-item')
  .set({
    title: 'div.document__title > a',
    date: 'div.document__time',
    link: 'div.document__title > a@href',
  })
  .data(function(content) {
    if ((Object.keys(content)).length !== 0) {
      console.log(content);
    };
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log); */


