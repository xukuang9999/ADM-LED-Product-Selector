import fs from 'fs';

const checkEmptyUrls = (file) => {
  const data = fs.readFileSync(file, 'utf8');
  const urlRegex = /"id":(\d+),"sku":"([^"]+)".*?"url":"([^"]*)"/g;
  let match;
  while ((match = urlRegex.exec(data)) !== null) {
    if (!match[3]) {
      console.log(`${file}: ID ${match[1]} (${match[2]}) has empty URL`);
    }
  }
};

checkEmptyUrls('src/data1.ts');
checkEmptyUrls('src/data2.ts');
