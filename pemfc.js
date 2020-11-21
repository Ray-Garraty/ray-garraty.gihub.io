const fs = require('fs');
const osmosis = require('osmosis');
const htmlCreator = require('html-creator');

const firstPageUrlAddress = 'https://fuelcellsworks.com/news';
const numberOfPages = 10;
const resultFileName = 'pemfc.htm';

/* обычная функция scrapeTitleFrom... на основе osmosis: принимает на вход url-адрес и номер страницы, 
возвращает промис, который разрешается в объект с данными новостей этой страницы */
const scrapeTitleFromFuelCellsWorks = (url, num) => {
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
      content.date = content.date.split('|')[0].toString();
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

const scrapeNewsFromPowerCell = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.powercell.se/en/newsroom/press-releases/')
    .find('div#releaseArchive li')
    .set({
      title: 'a',
      date: 'span.meta',
      link: 'a@href'
    })
    .data(function(content) {
      content.date = content.date.split('•')[0].toString().trim();
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromBallard = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.ballard.com/about-ballard/newsroom/news-releases')
    .find('ul.news-release li')
    .set({
      title: 'a',
      date: 'span.date',
      link: 'a@href'
    })
    .data(function(content) {
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromNuvera = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.nuvera.com/blog/topic/press-releases')
    .find('div.act-blog-post-listing-full-item')
    .set({
      title: 'a',
      date: 'span.act-blog-post-published-on',
      link: 'a@href'
    })
    .data(function(content) {
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromIntelligentEnergy = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.intelligent-energy.com/news-and-events/company-news/')
    .find('div.article-list header')
    .set({
      title: 'a',
      date: 'p.date',
      link: 'a@href'
    })
    .data(function(content) {
      content.date = `${content.date.slice(17)}`;
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromProtonMotor = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
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
    .data(function(content) {
      content.date = content.date.slice(0, 10).split('/').reverse().join('/');
      result.push({
        pageContent: content,
      });
    })
    .done(() => resolve(result.sort((a, b) => a.date - b.date)))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromBMPower = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('http://bmpower.ru/news')
    .find('div.item')
    .set({
      title: 'a',
      date: 'div.dte',
      link: 'a@href'
    })
    .data(function(content) {
      content.date = content.date.split(',')[0].toString().split('.').reverse().join('/');
      result.push({
        pageContent: content,
      });
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromElringKlinger = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.elringklinger.de/en/press/press-releases')
    .find('div.view-content div.section--region')
    .set({
      title: 'h3',
      date: 'span.date-display-single',
      link: 'a@href'
    })
    .data(function(content) {
      content.date = content.date.split('-')[0].toString().trim();
      result.push({
        pageContent: content,
      });
    })
    .done(() => resolve(result))
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromMyFC = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.myfc.se/investor-relations/archives/news?setLang=en')
    .find('div.prm-archive-text')
    .set({
      title: 'h4',
      date: 'div.typography-small-body',
      link: 'a@href'
    })
    .data(function(content) {
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromHelbio = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://helbio.com/news/')
    .find('article')
    .set({
      title: 'h2',
      day: 'span.fusion-date',
      monthAndYear: 'span.fusion-month-year',
      link: 'a@href',
    })
    .data(function(content) {
      content.date = (`${content.day.padStart(2, 0)}, ${content.monthAndYear}`).split(', ').reverse().join('/'),
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromKeyYou = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.keyou.de/news/?lang=en')
    .find('div.site-inner article')
    .set({
      title: 'a.entry-title-link',
      date: 'time',
      link: 'a.entry-title-link@href',
    })
    .data(function(content) {
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromPlugPower = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.plugpower.com/in_the_news/')
    .find('article')
    .set({
      title: 'h4 > a',
      date: 'span.date',
      link: 'h4 > a@href',
    })
    .data(function(content) {
      const regex = /[A-Z]\w{5,} \d{1,}, \d{4}/m;
      content.date = content.date.match(regex);
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      const slicedResult = result.slice(0, 5);
      return resolve(slicedResult);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
  }); 
};

const scrapeNewsFromPlugPower = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis
    .get('https://www.plugpower.com/in_the_news/')
    .find('article')
    .set({
      title: 'h4 > a',
      date: 'span.date',
      link: 'h4 > a@href',
    })
    .data(function(content) {
      const regex = /[A-Z]\w{5,} \d{1,}, \d{4}/m;
      content.date = content.date.match(regex);
      result.push({
        pageContent: content,
      });
    })
    .done(() => {
      return resolve(slicedResult);
    })
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
  /* for (let i = 1; i <= numberOfPages; i += 1) {
    const url = `${firstPageUrl}/page/${i}/`;
    const newsFromPageI = scrapeTitleFromFuelCellsWorks(url, i);
    promises = [...promises, newsFromPageI];
  } */
  promises = [
    /* ...promises,
    scrapeNewsFromPowerCell(),
    scrapeNewsFromBallard(),
    scrapeNewsFromNuvera(),
    scrapeNewsFromIntelligentEnergy(),
    scrapeNewsFromProtonMotor(),
    scrapeNewsFromBMPower(),
    scrapeNewsFromElringKlinger(),
    scrapeNewsFromMyFC(),
    scrapeNewsFromHelbio(),
    scrapeNewsFromKeyYou(), */
    scrapeNewsFromPlugPower(),
  ];
  const news = await Promise.all(promises);
  const sortedNews = news.sort((a, b) => a.pageNumber - b.pageNumber);
  return sortedNews;
};

// простая функция createHtmlFromNestedArray, которая принимает на вход массив новостей и генерирует HTML-код с ними
const createHtml = (news) => {
  const contentArray = news.flatMap((newsFromPage, pageIndex) => {
    return newsFromPage.map((element, index) => {
      const parsedDate = new Date(element.pageContent.date);
      const dateOutputOptions = {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
      const formattedDate = `${parsedDate.toLocaleDateString('ru-RU', dateOutputOptions)}: `;
      const result = {
        type: 'p',
        content: [
          {
            type: 'span',
            content: formattedDate,
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
  }); 
  const html = new htmlCreator([
    {
      type: 'head',
      content: [{ type: 'title', content: 'Новости ТЭПМ и ЭТЭ' }]
    },
    {
      type: 'body',
      attributes: { style: 'padding: 1rem' },
      content: [
        {
          type: 'h3',
          content: 'ТЭПМ и ЭТЭ',
          attributes: {},
        },
        {
          type: 'div',
          content: contentArray,
          attributes: {},
        },  
      ],
    },
  ]);
  return html;
};

// асинхронная функция writeHtmlToFile, которая записывает в файл html-код
const writeHtmlToFile = (html) => {
  const data = html.renderHTML();
  fs.writeFile(resultFileName, data, 'utf-8', () => console.log(`The ${resultFileName} file has been succesfully created!`));
};

generateNewsArray(firstPageUrlAddress, numberOfPages)
.then((newsArray) => createHtml(newsArray))
.then((html) => writeHtmlToFile(html))
.catch(console.error);