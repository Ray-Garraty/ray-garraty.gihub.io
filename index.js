const osmosis = require('osmosis');

osmosis
    .get('https://www.keyou.de/news/?lang=en')
    .find('div.site-inner article')
    .set({
      title: 'a.entry-title-link',
      date: 'time',
      link: 'a.entry-title-link@href',
    })
    .data(console.log)
    .log(console.log)
    .error(console.log)
    .debug(console.log);
