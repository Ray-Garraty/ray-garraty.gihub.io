const osmosis = require('osmosis');
// osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
osmosis
    .get('http://www.nawatechnologies.com/en/category/actualites-en/')
    .find('div.fusion-post-content')
    .set({
      title: 'a',
      date: 'span:nth-child(4)',
      link: 'a@href',
    })
    .data(function(content) {
      console.log(content);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);