const fs = require('fs');
const osmosis = require('osmosis');
const htmlCreator = require('html-creator');

const firstPageUrlAddress = 'https://fuelcellsworks.com/news';
const numberOfPages = 1;

/* асинхронная функция scrapeTitle на основе osmosis: принимает на вход url-адрес и номер страницы, 
возвращает промис, который разрешается в объект с данными одной новости */
const scrapeTitle = async (url, num) => {
  const result = [];
  await osmosis
    .get(url)
    .find('.article-content-wrap')
    .set({
      title: 'h2',
      date: '.desktop-reading',
      link: 'h2 > a@href'
    })
    .data(function(content) {
      result.push({
        pageNumber: num,
        pageContent: content,
      });
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  return result;
};

/* функция-генератор массива новостей generateNewsArray: принимает на вход url-адрес первой страницы и
количество страниц, которое нужно обойти, формирует массив промисов, 
дожидается разрешения Promise.all по ним, выдаёт массив новостей и сортирует его по номеру страницы */
const generateNewsArray = async (firstPageUrl, numberOfPages) => {
  const promises = [];
  for (let i = 1; i <= numberOfPages; i += 1) {
    const url = `${firstPageUrl}/page/${i}/`;
    const newsFromPage = scrapeTitle(url, i);
    promises.concat(newsFromPage);
  }
  const news = await Promise.all(promises);
  const sortedNews = news.sort((a, b) => a.pageNumber - b.pageNumber);
  // console.log(sortedNews);
  return sortedNews;
};

// простая функция createHtml, которая принимает на вход массив новостей и генерирует HTML-код с ними
const createHtml = (news) => {
  const contentArray = news.map((element) => {
    const result = {
      type: 'p',
      content: [
        {
          type: 'div',
          content: element.pageContent.date.split('|')[0].toString(),
          attributes: {},
        },
        {
          type: 'a',
          content: element.pageContent.title,
          attributes: { href: element.pageContent.link, target: '_blank' },
        },
      ],
    };
    return result;
  });
  const html = new htmlCreator([
    {
      type: 'head',
      content: [{ type: 'title', content: 'News from Fuelcellsworks.com' }]
    },
    {
      type: 'body',
      attributes: { style: 'padding: 1rem' },
      content: contentArray,
    },
  ]);
  return html;
};

// асинхронная функция writeHtmlToFile, которая записывает в файл html-код
const writeHtmlToFile = (html) => {
  // const data = JSON.stringify(html, null, 2);
  const data = html.renderHTML();
  fs.writeFile('index.htm', data, 'utf-8', () => console.log('The index.htm file has been succesfully created!'));
};

generateNewsArray(firstPageUrlAddress, numberOfPages)
.then((newsArray) => createHtml(newsArray))
.then((html) => writeHtmlToFile(html))
.catch(console.error);

/* const result = [];
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

setTimeout(sortAndWriteResultsToFile, 5000, result); */