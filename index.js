const osmosis = require('osmosis');

const queryString = 'natural+gas+reforming';

const scrapeNewsFromGoogleScholar = (queryString) => {
  const convertDateFromRelativeToAbsolute = (relativeDate) => {
    let msecsDiff = 0;
      if (relativeDate) {
        if (relativeDate.includes('days')) {
          const daysDiff = Number(relativeDate.split(' ')[0]);
          const msecsInAday = 8.64e+7;
          msecsDiff = daysDiff * msecsInAday;
        }
      }
      const currentDateInMsecs = Date.now();
      const result = new Date(currentDateInMsecs - msecsDiff);
      return result.toLocaleDateString('en-US');
  };
  
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
      .get(`https://scholar.google.com/scholar?hl=en&scisbd=1&as_sdt=1%2C5&q=${queryString}&btnG=`)
      .paginate('a.gs_nma', 1)
      .find('div.gs_ri')
      .set({
        title: 'a',
        date: 'span.gs_age',
        link: 'a@href',
      })
      .data(function(content) {
        content.date = convertDateFromRelativeToAbsolute(content.date);
        result.push(content);
      })
      .done(() => resolve(result))
      .log(console.log)
      .error(console.log)
      .debug(console.log);
    }); 
};

scrapeNewsFromGoogleScholar(queryString).then(console.log);