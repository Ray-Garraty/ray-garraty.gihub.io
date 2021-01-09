#!/usr/bin/env node
const src = require('./src.js');

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
        const month = src.translateMonth(russianMonth);
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
  const datePlug = '1970/01/01';
  return datePlug;
};

const a = '07:10';
const b = 'вчера в 15:45';
const c = '07 января в 23:38';
const d = '30.12.20 в 03:14';
const e = 'сегодня в 00:00';

console.log(convertScrapedDateToCommonFormat(a));
console.log(convertScrapedDateToCommonFormat(b));
console.log(convertScrapedDateToCommonFormat(c));
console.log(convertScrapedDateToCommonFormat(d));
console.log(convertScrapedDateToCommonFormat(e));
