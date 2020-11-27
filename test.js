#!/usr/bin/env node

const osmosis = require('osmosis');
// osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');

const queryString = '%D0%BB%D0%B8%D1%82%D0%B8%D0%B9-%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5+%D0%B0%D0%BA%D0%BA%D1%83%D0%BC%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%D1%8B';

osmosis
    .get(`https://newssearch.yandex.ru/yandsearch?text=${queryString}&rpt=nnews2&grhow=clutop&wiz_no_news=1&rel=tm`)
    .config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
    .config('tries', 1)
    .config('concurrency', 1)
    .delay(5000)
    .paginate('div.pager__content :nth-child(3)')
    .find('div.documents :first-child')
    .set({
      title: 'div.document__title > a',
      date: 'div.document__time',
      link: 'div.document__title > a@href',
    })
    .data(function(content) {
      console.log(content);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
    

    