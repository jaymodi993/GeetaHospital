const https = require('https');
const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'home.html', url: 'https://geetahospitalmundra.com/' },
  { name: 'about.html', url: 'https://geetahospitalmundra.com/about-us/' },
  { name: 'services.html', url: 'https://geetahospitalmundra.com/services/' },
  { name: 'contact.html', url: 'https://geetahospitalmundra.com/contact/' },
];

function fetchPage(p) {
  return new Promise((resolve) => {
    https.get(p.url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(path.join('scripts', p.name), data);
        resolve(`${p.name}: ${data.length} bytes`);
      });
    }).on('error', (err) => resolve(`${p.name} error: ${err.message}`));
  });
}

Promise.all(pages.map(fetchPage)).then(results => {
  console.log(results.join('\n'));
});
