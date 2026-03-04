import fs from 'fs';

const data1 = fs.readFileSync('src/data1.ts', 'utf8');
const data2 = fs.readFileSync('src/data2.ts', 'utf8');

const extractDatasheets = (dataStr) => {
  const urls = [];
  const datasheetRegex = /"datasheet":"([^"]*)"/g;
  
  let match;
  while ((match = datasheetRegex.exec(dataStr)) !== null) {
    urls.push(match[1]);
  }
  return urls;
};

const allDatasheets = [...extractDatasheets(data1), ...extractDatasheets(data2)];
const emptyDatasheets = allDatasheets.filter(u => !u);
console.log(`Total products: ${allDatasheets.length}`);
console.log(`Products with empty datasheets: ${emptyDatasheets.length}`);
