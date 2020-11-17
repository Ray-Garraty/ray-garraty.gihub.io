var osmosis = require('osmosis');
const result = [];
for (let j = 1; j <= 3; j += 1) {
    const url = j === 1 ? 'https://fuelcellsworks.com/news/' : `https://fuelcellsworks.com/news/page/${j}/`;
    osmosis
        .get(url)
        .find('.article-content-wrap')
        .set({
          Title: 'h2',
          Date: '.desktop-reading',
          Link: 'h2 > a@href'
        })
        .data(function(content) {
          result.push({
            pageNumber: j,
            pageContent: content,  
          })
        })
        .log(console.log)
        .error(console.log)
        .debug(console.log)   
};
const showResults = (array) => {
  const sortedResult = array.sort((a, b) => a.pageNumber - b.pageNumber);
  console.log(sortedResult);
};
setTimeout(showResults, 5000, result);