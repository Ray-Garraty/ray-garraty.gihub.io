const osmosis = require('osmosis');

const queryString = 'natural+gas+reforming';

/* osmosis
    .get(`https://scholar.google.com/scholar?hl=en&scisbd=1&as_sdt=1%2C5&q=${queryString}&btnG=`)
    .paginate('td > a', 1)
    .find('div.gs_ri')
    .set({
      title: 'a',
      date: 'span.gs_age',
      link: 'a@href',
    })
    .data(console.log)
    .log(console.log)
    .error(console.log)
    .debug(console.log); */
   const dateString = '3 Days ago';
   const dateDiff = dateString.split(' ')[0] * 8.64e+7;
   const currentDate = new Date(Date.now());
   const articleDate = new Date(currentDate - dateDiff);
   const result = articleDate.toLocaleDateString('en-US');
   console.log(result);