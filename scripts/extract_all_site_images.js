const fs = require('fs');
const path = require('path');

const files = ['home.html', 'about.html', 'services.html', 'contact.html', 'doctors_page.html'];
const allUrls = new Set();
const pageMap = {};

files.forEach(f => {
  const p = path.join('scripts', f);
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const regex = /https:\/\/geetahospitalmundra\.com\/wp-content\/uploads\/[^\s\"\'\<\>]+/g;
    const matches = html.match(regex) || [];
    matches.forEach(url => {
      // Clean query params or escaped quotes
      const cleanUrl = url.split('&')[0].replace(/["'<>]/g, '');
      allUrls.add(cleanUrl);
      if (!pageMap[cleanUrl]) pageMap[cleanUrl] = [];
      if (!pageMap[cleanUrl].includes(f)) pageMap[cleanUrl].push(f);
    });
  }
});

console.log('Total unique upload URLs found:', allUrls.size);
Array.from(allUrls).sort().forEach(u => {
  console.log(u, '--> in', pageMap[u].join(', '));
});
