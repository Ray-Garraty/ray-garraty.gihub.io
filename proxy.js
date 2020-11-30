const fs = require('fs');
const https = require('https');

exports.getProxiesList = () => {
  const options = {
    host: 'api.proxyscrape.com',
    path: '/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all'
  }
  return new Promise((resolve, reject) => {
    const result = [];
    const request = https.request(options, function (res) {
      res.on('data', function (chunk) {
        result.push(chunk);
      });
      res.on('end', function () {
        console.log('The proxies list has been successfully extracted!');
        const array = result.toString().split('\r\n').map(item => {
          const [ip, port] = item.split(':');
          return {ip, port};
        });
        return resolve(array);
      });
    });
      request.on('error', function (e) {
      console.log(e.message);
    });
      request.end();
  });
};

exports.readProxiesListFromFile = (path) => {
  const data = fs.readFileSync(path, 'utf-8');
  const array = data.split('\r\n').map(item => {
    const [ip, port] = item.split(':');
    return {ip, port};
  });
  return array; 
};

exports.chooseRandomProxyFromList = (list) => {
  const proxyServerIndex = Math.round(Math.random() * list.length);
  const chosenProxy = list[proxyServerIndex];
  const result = `${chosenProxy.ip}:${chosenProxy.port}`
  console.log('Using proxy-server: ', result);
  return result;
};