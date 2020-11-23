const fs = require('fs');
const _ = require('lodash');
const osmosis = require('osmosis');
const htmlCreator = require('html-creator');

// простая функция parseDate - принимает на вход строку даты в нестандартной формате
// (сграбленную с сайта) и преобразует её в число мс с 01.01.1970
const parseDate = (dateStringFromSite) => Date.parse(dateStringFromSite);

// простая функция formatDate - принимает на вход дату в виде числа мс с 01.01.1970
// и преобразует её в строковое представление для HTML-отображения 
const formatDate = (msDate) => {
  const dateOutputOptions = {
    year: "numeric",
    month: "short",
    day: "numeric"
  }
  const date = new Date(msDate);
  const formattedDate = `${date.toLocaleDateString('ru-RU', dateOutputOptions)}: `;
  return formattedDate;
};

/* функция-генератор массива новостей generateNewsArray: формирует массив промисов, 
дожидается разрешения Promise.all по ним, сортирует полученный массив новостей по дате и выдаёт его */
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
  return result;
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
   
  const html = new htmlCreator([
    {
      type: 'head',
      content: [{ type: 'title', content: header }]
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

// асинхронная функция writeHtmlToFile, которая записывает в файл html-код
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
  
  return new Promise((resolve, reject) => {
    const result = [];
    osmosis.config('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
    osmosis.config('tries', 1)
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
      .data(function(content) {
        content.date = convertDateFromRelativeToAbsolute(content.date);
        result.push(content);
      })
      .done(() => {
        if (!result.length) {
          const failObject = {};
          failObject.title = "No results from Google Scholar...";
          result.push(failObject);
        }
        return resolve(result);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
    }); 
};