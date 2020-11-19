const osmosis = require('osmosis');

/*  osmosis
    .get('https://www.proton-motor.de/gb/news/press/')
    .find('div.col-sm-6.newstext')
    .set({
      title: 'h1',
      link: 'a@href'
    })
    .follow('a@href')
    .set({
      date: 'p.float-text',
    })
    .data(console.log)
    .log(console.log)
    .error(console.log)
    .debug(console.log); */

const dateString = 'November 19, 2020';
const parsedDate = new Date(dateString);
console.log(parsedDate);
const formattedDate = parsedDate.toLocaleDateString('ru-RU');
console.log(formattedDate);
