const osmosis = require('osmosis');
// osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
osmosis
    .get('https://www.liotech.ru/media/')
    .find('div.news-block')
    .set({
      title: 'div.news-block__title',
      date: 'div.news-block__date',
      link: '@data-href',
    })
    .data(function(content) {
      console.log(content);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);

    