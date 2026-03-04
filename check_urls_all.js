import fs from 'fs';
import https from 'https';

const checkUrl = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ url, status: 'empty' });
      return;
    }
    const req = https.request(url, { 
      method: 'HEAD', 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
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

const run = async () => {
  const data1 = fs.readFileSync('src/data1.ts', 'utf8');
  const data2 = fs.readFileSync('src/data2.ts', 'utf8');
  
  const extractUrls = (dataStr) => {
    const urls = [];
    const urlRegex = /"url":"([^"]+)"/g;
    
    let match;
    while ((match = urlRegex.exec(dataStr)) !== null) {
      if (match[1]) {
        urls.push({ type: 'url', link: match[1] });
      }
    }
    return urls;
  };

  const allUrls = [...extractUrls(data1), ...extractUrls(data2)].filter(u => u.link);
  
  const results = [];
  for (let i = 0; i < allUrls.length; i += 10) {
    const batch = allUrls.slice(i, i + 10);
    const batchResults = await Promise.all(batch.map(async item => {
      const res = await checkUrl(item.link);
      return { ...item, status: res.status, error: res.error };
    }));
    results.push(...batchResults);
  }

  const not200 = results.filter(r => r.status !== 200 && r.status !== 301 && r.status !== 302 && r.status !== 308);
  console.log('\nNot 200 Links:');
  not200.forEach(b => console.log(`${b.status} - ${b.link} ${b.error ? '(' + b.error + ')' : ''}`));
};

run();
