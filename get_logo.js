import https from 'https';

https.get('https://www.admtech.com.au/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src="([^">]+)"/gi);
    if (matches) {
      matches.forEach(m => {
        if (m.toLowerCase().includes('logo') || m.toLowerCase().includes('adm')) {
          console.log(m);
        }
      });
    }
  });
});
