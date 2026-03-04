import https from 'https';

const url = "https://www.power-supplies-australia.com.au/sites/default/files/specifications/ADM%20NF-TBD-24V-5M-10X10MM-XXK-IP67%20DATA%20SHEET.pdf";

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(e);
});
