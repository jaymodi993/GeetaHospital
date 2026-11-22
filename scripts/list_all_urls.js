const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');

const regex = /https:\/\/geetahospitalmundra\.com\/wp-content\/uploads\/[^\s\"\'\<\>]+/g;
const matches = [...new Set(html.match(regex) || [])];
console.log('All upload URLs in doctors_page.html (' + matches.length + '):');
matches.forEach(m => console.log(m));
