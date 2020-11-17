const fs = require('fs');
const osmosis = require('osmosis');
const htmlCreator = require('html-creator');

const result = [];
for (let j = 1; j <= 3; j += 1) {
    const url = j === 1 ? 'https://fuelcellsworks.com/news/' : `https://fuelcellsworks.com/news/page/${j}/`;
    osmosis
        .get(url)
        .find('.article-content-wrap')
        .set({
          title: 'h2',
          date: '.desktop-reading',
          link: 'h2 > a@href'
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

const createContentArray = (dataset) => dataset.map((element) => {
    return [
      {
        type: 'p',
        content: [
          {
            type: 'div',
            content: element.pageContent.date,
            attributes: {},
          },
          {
            type: 'a',
            content: element.pageContent.title,
            attributes: { href: element.pageContent.link, target: '_blank' },
          },
        ],
      },
    ];
  });
  
  const generateHtmlFromDataset = (contentArray) => {
    const html = new htmlCreator([
      {
        type: 'head',
        content: [{ type: 'title', content: 'Generated HTML' }]
      },
      {
        type: 'body',
        attributes: { style: 'padding: 1rem' },
        content: contentArray,
      },
    ]);
    return html;
  };

const sortAndWriteResultsToFile = (array) => {
  const sortedResult = array.sort((a, b) => a.pageNumber - b.pageNumber);
  const html = generateHtmlFromDataset(array);
  fs.writeFileSync('index.html', html, 'utf-8');
};

setTimeout(sortAndWriteResultsToFile, 5000, result);