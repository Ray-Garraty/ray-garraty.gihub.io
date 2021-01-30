const fs = require('fs');
const https = require('https');

exports.getProxiesList = () => {
  const options = {
    host: 'api.proxyscrape.com',
    path: '/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
  };
  return new Promise((resolve, reject) => {
    const result = [];
    const request = https.request(options, (res) => {
      res.on('data', (chunk) => {
        result.push(chunk);
      });
      res.on('end', () => {
        console.log('The proxies list has been successfully extracted!');
        const array = result.toString().split('\r\n').map((item) => {
          const [ip, port] = item.split(':');
          return { ip, port };
        });
        return resolve(array);
      });
    });
    request.on('error', (e) => {
      console.log(e.message);
    });
    request.end();
  });
};

exports.readProxiesListFromFile = (path) => {
  const data = fs.readFileSync(path, 'utf-8');
  const array = data.split('\r\n').map((item) => {
    const [ip, port] = item.split(':');
    return { ip, port };
  });
  return array;
};

exports.chooseRandomProxyFromList = (list) => {
  const proxyServerIndex = Math.round(Math.random() * list.length);
  const chosenProxy = list[proxyServerIndex];
  const result = `${chosenProxy.ip}:${chosenProxy.port}`;
  console.log('Using proxy-server: ', result);
  return result;
};

// const queryString = '%D0%BB%D0%B8%D1%82%D0%B8%D0%B9-%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5+%D0%B0%D0%BA%D0%BA%D1%83%D0%BC%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%D1%8B';
// let proxiesList;
/* getProxies.then(result => {
  proxiesList = [...result];
}); */

// proxiesList = proxy.readProxiesListFromFile('http_proxies.txt');
