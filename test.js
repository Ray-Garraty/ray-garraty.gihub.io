const osmosis = require('osmosis');
// osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
osmosis
    .get('http://teemp.ru/news/')
    .find('div.news-item')
    .set({
      title: 'div.title.p-b-20',
      date: 'span.label',
      link: 'div.row > a@href',
    })
    .data(function(content) {
      console.log(content);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);