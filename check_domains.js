import fs from 'fs';

const run = () => {
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

  const allUrls = [...extractUrls(data1), ...extractUrls(data2)];
  
  const allowedDomains = [
    'www.power-supplies-australia.com.au',
    'shop.admtech.com.au',
    'www.led-supplies-australia.com.au'
  ];

  const invalidDomainLinks = allUrls.filter(item => {
    if (!item.link) return false;
    try {
      const url = new URL(item.link);
      return !allowedDomains.includes(url.hostname);
    } catch (e) {
      return true; // Invalid URL
    }
  });

  console.log('Links with incorrect domains or invalid URLs:');
  invalidDomainLinks.forEach(b => console.log(`${b.type}: ${b.link}`));
  if (invalidDomainLinks.length === 0) {
    console.log('All links have correct domains.');
  }
};

run();
