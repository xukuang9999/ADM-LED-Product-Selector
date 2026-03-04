import https from 'https';

const checkUrl = (url) => {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', (e) => {
      resolve({ url, status: 'error', error: e.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 'timeout' });
    });
    req.end();
  });
};

checkUrl('https://www.power-supplies-australia.com.au/ls-60-24v-5m-10mm-rgb-ip67').then(console.log);
