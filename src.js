const fs = require('fs');
const _ = require('lodash');
const axios = require('axios');
const xml2js = require('xml2js');
const osmosis = require('osmosis');
const HtmlCreator = require('html-creator');

// функция для заполнения значений, по которым скрэйперу не удалось собрать данных
const fillUpAbsentData = exports.fillUpAbsentData = (newsItem, resourceName) => {
  const absentKeys = _.difference(['title', 'date', 'link'], Object.keys(newsItem));
  absentKeys.forEach((key) => {
    if (key === 'date') {
      newsItem[key] = (new Date()).toLocaleDateString('ru-RU');
    } else {
      newsItem[key] = `С ресурса "${resourceName}" не удалось получить ${key}`;
    }
  });
  return newsItem;
};

// простая функция parseDate - принимает на вход строку даты в нестандартной формате
// (сграбленную с сайта) и преобразует её в число мс с 01.01.1970
const parseDate = (dateStringFromSite) => Date.parse(dateStringFromSite);

// простая функция formatDate - принимает на вход дату в виде числа мс с 01.01.1970
// и преобразует её в строковое представление для HTML-отображения
const formatDate = (msDate) => {
  const dateOutputOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const date = new Date(msDate);
  const formattedDate = `${date.toLocaleDateString('ru-RU', dateOutputOptions)}: `;
  return formattedDate;
};

/* функция-генератор массива новостей generateNewsArray: формирует массив промисов, дожидается
разрешения Promise.all по ним, сортирует полученный массив новостей по дате и выдаёт его */
const msInDay = 86400000;
const cutoffPeriodInDays = 14; // задаём период в днях, старше которого нам новости не нужны
exports.generateNewsArray = async (list) => {
  const promises = [...list];
  const news = await Promise.all(promises);
  const flatNewsArray = _.flattenDeep(news);
  const uniqueNewsArray = _.uniqWith(flatNewsArray, _.isEqual);
  uniqueNewsArray.forEach((element) => {
    element.date = parseDate(element.date);
  });
  const newsSortedByDate = _.sortBy(uniqueNewsArray, (element) => element.date);
  const result = newsSortedByDate.reverse();
  const today = Date.now();
  const cutoffDate = today - (cutoffPeriodInDays * msInDay);
  return result.filter((item) => item.date > cutoffDate);
};

// простая функция createHtmlFromNestedArray, которая принимает на вход массив новостей
// и генерирует HTML-код с ними
exports.createHtml = (news, header) => {
  const contentArray = news.map((element) => {
    const formattedDate = formatDate(element.date);
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
          content: element.title,
          attributes: { href: element.link, target: '_blank' },
        },
      ],
    };
    return result;
  });

  const html = new HtmlCreator([
    {
      type: 'head',
      content: [{ type: 'title', content: header }],
    },
    {
      type: 'body',
      attributes: { style: 'padding: 1rem' },
      content: [
        {
          type: 'h3',
          content: header,
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

exports.writeHtmlToFile = (html, resultFileName) => {
  const data = html.renderHTML();
  fs.writeFile(resultFileName, data, 'utf-8', () => console.log(`The ${resultFileName} file has been succesfully created!`));
};

exports.scrapeNewsFromGoogleScholar = (queryString) => {
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

  return new Promise((resolve) => {
    const result = [];
    osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
    osmosis.config('tries', 1);
    osmosis.config('concurrency', 2);
    osmosis
      .get(`https://scholar.google.com/scholar?hl=en&scisbd=1&as_sdt=1%2C5&q=${queryString}&btnG=`)
      .delay(2000)
      .paginate('a.gs_nma', 1)
      .find('div.gs_ri')
      .set({
        title: 'a',
        date: 'span.gs_age',
        link: 'a@href',
      })
      .data((content) => {
        content.date = convertDateFromRelativeToAbsolute(content.date);
        result.push(fillUpAbsentData(content, 'Google Scholar'));
      })
      .done(() => {
        if (!result.length) {
          const failObject = {};
          failObject.title = 'No results from Google Scholar...';
          result.push(failObject);
        }
        return resolve(result);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
  });
};

const translateMonth = exports.translateMonth = (monthInRussian) => {
  const monthsTranslations = {
    января: 'January',
    февраля: 'February',
    марта: 'March',
    апреля: 'April',
    мая: 'May',
    июня: 'June',
    июля: 'July',
    августа: 'August',
    сентября: 'September',
    октября: 'October',
    ноября: 'November',
    декабря: 'December',
    январрь: 'January',
    январь: 'January',
    февраль: 'February',
    март: 'March',
    апрель: 'April',
    май: 'May',
    июнь: 'June',
    июль: 'July',
    август: 'August',
    сентябрь: 'September',
    октябрь: 'October',
    ноябрь: 'November',
    декабрь: 'December',
  };
  if (!monthsTranslations[monthInRussian]) {
    console.log(`Некорректное название месяца: ${monthInRussian}`);
    return;
  }
  return monthsTranslations[monthInRussian];
};

// эта функция требует доработки для предотвращения выдачи капчи
exports.scrapeNewsFromYandexNews = (queryString) => {
  const convertScrapedDateToCommonFormat = (string) => {
    const processors = [
      {
        example: '07:10',
        regex: /^\d{2}:\d{2}/,
        processingFunction: () => {
          const currentDate = new Date();
          return currentDate.toLocaleDateString('ru-RU');
        },
      },
      {
        example: 'вчера в 15:45',
        regex: /вчера\s\W\s\d{2}:\d{2}/,
        processingFunction: () => {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - 1);
          return currentDate.toLocaleDateString('ru-RU');
        },
      },
      {
        example: '07 января в 23:38',
        regex: /\d{2}\s\W{3,}\s\W\s\d{2}:\d{2}/,
        processingFunction: (dateString) => {
          const currentDate = new Date();
          const fullYear = currentDate.getFullYear();
          const [fullDay, russianMonth] = dateString.split(/\s/);
          const month = translateMonth(russianMonth);
          return `${fullYear}/${month}/${fullDay}`;
        },
      },
      {
        example: '30.12.20 в 03:14',
        regex: /\d{2}.\d{2}.\d{2}\s\W\s\d{2}:\d{2}/,
        processingFunction: (dateString) => {
          const [shortDate] = dateString.split(/\s/);
          const [day, month, shortYear] = shortDate.split('.');
          const fullYear = shortYear.padStart(4, '20');
          const fullDay = day.padStart(2, '0');
          return `${fullYear}/${month}/${fullDay}`;
        },
      },
    ];
    const [processor] = processors.filter((proc) => Array.isArray(string.match(proc.regex)));
    if (processor) {
      return processor.processingFunction(string);
    }
    console.log(`Незарегистрированный формат даты с Яндекс.Новостей: "${string}"`);
    const datePlug = (new Date()).toLocaleDateString('ru-RU');
    return datePlug;
  };

  return new Promise((resolve) => {
    const result = [];
    osmosis
      .get(`https://newssearch.yandex.ru/yandsearch?text=${queryString}&rpt=nnews2&grhow=clutop&wiz_no_news=1&rel=tm`)
      .config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
      .config('tries', 1)
      .config('concurrency', 1)
      .delay(2000)
      .paginate('div.pager__content :nth-child(3) > a', 3)
      .delay(2000)
      .find('li.search-item')
      .set({
        title: 'div.document__title > a',
        date: 'div.document__time',
        link: 'div.document__title > a@href',
      })
      .data((content) => {
        if (Object.keys(content).length === 0) {
          content.title = 'Смени IP';
        } else {
          content.date = convertScrapedDateToCommonFormat(content.date);
        }
        result.push(fillUpAbsentData(content, 'Яндекс'));
      })
      .done(() => {
        if (!result.length) {
          const failObject = {};
          failObject.title = 'Результатов с Яндекс-Новостей не получено совсем. Пора менять IP.';
          result.push(failObject);
        }
        return resolve(result);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
  });
};

const getRSSFeedFromUrl = (url) => new Promise((resolve) => {
  axios({
    url,
    method: 'GET',
    responseType: 'blob',
  }).then((response) => resolve(response.data));
});

exports.generateNewsArrayFromRSS = (url, ...searchTerms) => {
  let newsArray;
  const rss = getRSSFeedFromUrl(url);
  return new Promise((resolve) => {
    rss.then((data) => {
      const parser = new xml2js.Parser();
      parser.parseString(data, (err, result) => {
        newsArray = result.rss.channel[0].item.map((newsItem) => {
          let res = null;
          const obj = {
            title: newsItem.title[0],
            link: newsItem.link[0],
            date: newsItem.pubDate[0],
          };
          if (!searchTerms.length) {
            res = obj;
          }
          searchTerms.forEach((term) => {
            if (newsItem.title[0].includes(term)) {
              res = obj;
            }
          });
          return res;
        });
      });
      return resolve(newsArray.filter((x) => x));
    });
  });
};
