const osmosis = require('osmosis');

// накидать сюда url-адресов источников новостей и по каждому настроить osmosis

    osmosis
    .get(url)
    .find('.article-content-wrap')
    .set({
      title: 'h2',
      date: '.desktop-reading',
      link: 'h2 > a@href'
    })
    .data(console.log)
    .log(console.log)
    .error(console.log)
    .debug(console.log);
