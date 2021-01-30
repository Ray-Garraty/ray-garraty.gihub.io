const _ = require('lodash');
const buttonElements = document.querySelectorAll('button');
const tableBodyElement = document.querySelector('tbody');
const messageFieldElement = document.querySelector('p.list-group-item');

// const serverUrl = 'https://ray-garraty-webscraper.ew.r.appspot.com';
const serverUrl = 'http://localhost:8080';

const handleButtonClick = (e) => {
  const { id } = e.target.dataset;
  buttonElements.forEach((element) => {
    element.classList.remove('active');
    element.disabled = true;
  });
  e.target.classList.add('active');
  messageFieldElement.classList.remove('text-primary');
  messageFieldElement.classList.add('text-warning');
  messageFieldElement.textContent = 'Пожалуйста, ожидайте...';
  fetch(`${serverUrl}/${id}`)
    .then((response) => response.text())
    .then((data) => {
      const news = JSON.parse(data);
      tableBodyElement.innerHTML = '';
      news.forEach((newsPost) => {
        const { date, title, link } = newsPost;
        const rowElement = document.createElement('tr');
        tableBodyElement.append(rowElement);
        const dateCellElement = document.createElement('td');
        dateCellElement.className = 'col-sm-1';
        dateCellElement.textContent = date;
        rowElement.append(dateCellElement);
        const titleCellElement = document.createElement('td');
        rowElement.append(titleCellElement);
        const titleElement = document.createElement('a');
        titleElement.textContent = title;
        titleElement.setAttribute('href', link);
        titleElement.setAttribute('target', '_blank');
        titleCellElement.append(titleElement);
      });
      buttonElements.forEach((element) => element.disabled = false);
      messageFieldElement.classList.remove('text-warning');
      if (_.isEmpty(news)) {
        messageFieldElement.classList.add('text-info');
        messageFieldElement.textContent = 'Свежих новостей по выбранной Вами тематике пока нет. Попробуйте повторить загрузку позже';
      } else {
        messageFieldElement.classList.add('text-success');
        messageFieldElement.textContent = 'Новости по выбранной Вами тематике загружены';
      }
    })
    .catch((error) => {
      console.error(error);
      buttonElements.forEach((element) => element.disabled = false);
      messageFieldElement.classList.remove('text-warning');
      messageFieldElement.classList.add('text-danger');
      messageFieldElement.textContent = 'Произошла ошибка. Если ты разработчик, проверь консоль разработчика';
    });
};

buttonElements.forEach((element) => element.onclick = handleButtonClick);
