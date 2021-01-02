#!/usr/bin/env node

const dateFromNews = '28.12.20 в 12:46';
const [shortDate, ...rest] = dateFromNews.split(/\s/);
const [day, month, shortYear] = shortDate.split('.');
const fullYear = shortYear.padStart(4, '20');
const fullDay = day.padStart(2, '0');
console.log(`${fullDay}/${month}/${fullYear}`);
