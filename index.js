const osmosis = require('osmosis');

osmosis
    .get('https://www.horizonfuelcell.com/mediacoverage')
    .find('section')
    .set({
      title: 'h2',
      date: 'p > span.color_16 > span > span',
      link: 'h2 span a@href',
    })
    .data(console.log)
    .log(console.log)
    .error(console.log)
    .debug(console.log);
