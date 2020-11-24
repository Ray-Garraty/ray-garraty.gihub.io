const osmosis = require('osmosis');
// osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
osmosis
    .get('https://energy.hse.ru/accenergy')
    .find('div.with-indent5._builder.builder--text')
    .set({
      title: 'em',
      date: 'p > span:nth-child(2)',
      link: 'a@href',
    })
    .data(function(content) {
      console.log(content);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);

    