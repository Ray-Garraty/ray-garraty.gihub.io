#!/usr/bin/env node

const osmosis = require('osmosis');
// osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
osmosis
    .get(`https://newssearch.yandex.ru/yandsearch?text=${inquiry}&rpt=nnews2&grhow=clutop&rel=tm`)
    .find('div.documents :first-child')
    .set({
      title: 'a',
      date: 'div.document__time',
      link: 'a@href',
    })
    .data(function(content) {
      content.date = content.date.split('|')[1].toString().trim();
      console.log(content);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);

    