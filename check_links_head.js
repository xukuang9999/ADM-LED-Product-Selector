import fs from 'fs';
import https from 'https';

const checkUrl = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ url, status: 'empty' });
      return;
    }
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

const run = async () => {
  const data1 = fs.readFileSync('src/data1.ts', 'utf8');
  const data2 = fs.readFileSync('src/data2.ts', 'utf8');
  
  const extractUrls = (dataStr) => {
    const urls = [];
    const urlRegex = /"url":"([^"]+)"/g;
    const datasheetRegex = /"datasheet":"([^"]+)"/g;
    
    let match;
    while ((match = urlRegex.exec(dataStr)) !== null) {
      urls.push({ type: 'url', link: match[1] });
    }
    while ((match = datasheetRegex.exec(dataStr)) !== null) {
      urls.push({ type: 'datasheet', link: match[1] });
    }
    return urls;
  };

  const allUrls = [...extractUrls(data1), ...extractUrls(data2)].filter(u => u.link);
  console.log(`Checking ${allUrls.length} URLs...`);
  
  const results = [];
  // Batch requests to avoid overwhelming
  for (let i = 0; i < allUrls.length; i += 20) {
    const batch = allUrls.slice(i, i + 20);
    const batchResults = await Promise.all(batch.map(async item => {
      const res = await checkUrl(item.link);
      return { ...item, status: res.status };
    }));
    results.push(...batchResults);
    console.log(`Checked ${Math.min(i + 20, allUrls.length)} / ${allUrls.length}`);
  }

  const broken = results.filter(r => r.status !== 200 && r.status !== 301 && r.status !== 302 && r.status !== 'empty');
  console.log('\nBroken Links:');
  broken.forEach(b => console.log(`${b.status} - ${b.type}: ${b.link}`));
  
  fs.writeFileSync('broken_links.json', JSON.stringify(broken, null, 2));
};

run();
