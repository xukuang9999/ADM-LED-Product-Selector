import fs from 'fs';
import https from 'https';

const data1 = fs.readFileSync('src/data1.ts', 'utf-8');
const data2 = fs.readFileSync('src/data2.ts', 'utf-8');

const urlRegex = /"url":"([^"]+)"/g;
const dsRegex = /"datasheet":"([^"]+)"/g;

const urls = new Set();
let match;
while ((match = urlRegex.exec(data1)) !== null) urls.add(match[1]);
while ((match = urlRegex.exec(data2)) !== null) urls.add(match[1]);
while ((match = dsRegex.exec(data1)) !== null) urls.add(match[1]);
while ((match = dsRegex.exec(data2)) !== null) urls.add(match[1]);

const checkUrl = (url) => {
  return new Promise((resolve) => {
    if (!url) return resolve({url, status: 'empty'});
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({url, status: res.statusCode});
    }).on('error', (e) => {
      resolve({url, status: e.message});
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({url, status: 'timeout'});
    });
  });
};

async function run() {
  console.log(`Checking ${urls.size} URLs...`);
  let brokenCount = 0;
  for (const url of urls) {
    const res = await checkUrl(url);
    if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
      console.log(`Broken: ${res.status} - ${url}`);
      brokenCount++;
    }
  }
  console.log(`Done. Found ${brokenCount} broken links.`);
}
run();
