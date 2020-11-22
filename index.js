const osmosis = require('osmosis');

osmosis
    .get('https://www.energy.gov/fe/listings/fe-press-releases-and-techlines')
    .find('div.node-article')
    .set({
      title: 'a.title-link',
      date: 'div.date',
      link: 'a.title-link @href',
    })
    .data(console.log)
    .log(console.log)
    .error(console.log)
    .debug(console.log);
