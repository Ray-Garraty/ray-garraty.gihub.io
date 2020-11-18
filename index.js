const fs = require('fs');
const osmosis = require('osmosis');
const htmlCreator = require('html-creator');

const firstPageUrlAddress = 'https://fuelcellsworks.com/news';
const numberOfPages = 1;

/* обычная функция scrapeTitle на основе osmosis: принимает на вход url-адрес и номер страницы, 
возвращает промис, который разрешается в объект с данными новостей этой страницы */
const scrapeTitle = (url, num) => {
  return new Promise((resolve, reject) => {
    const result = [];
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
        pageNumber: num,
        pageContent: content,
      });
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

/* функция-генератор массива новостей generateNewsArray: принимает на вход url-адрес первой страницы и
количество страниц, которое нужно обойти, формирует массив промисов, 
дожидается разрешения Promise.all по ним, выдаёт массив новостей и сортирует его по номеру страницы */
const generateNewsArray = async (firstPageUrl, numberOfPages) => {
  let promises = [];
  for (let i = 1; i <= numberOfPages; i += 1) {
    const url = `${firstPageUrl}/page/${i}/`;
    const newsFromPageI = scrapeTitle(url, i);
    promises = [...promises, newsFromPageI];
  }
  const news = await Promise.all(promises);
  const sortedNews = news.sort((a, b) => a.pageNumber - b.pageNumber);
  console.log(sortedNews);
  return sortedNews;
};

// простая функция createHtml, которая принимает на вход массив новостей и генерирует HTML-код с ними
const createHtml = (news) => {
  const contentArray = news[0].map((element) => {
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