import https from 'https';

https.get('https://www.admtech.com.au/themes/custom/admn/adm.logo.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
