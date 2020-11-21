const osmosis = require('osmosis');

osmosis
    .get('https://www.gencellenergy.com/news/')
    .find('a.post-box')
    .set({
      title: 'h3',
      date: 'strong',
      link: 'a@href',
    })
    .data(console.log)
    .log(console.log)
    .error(console.log)
    .debug(console.log);
