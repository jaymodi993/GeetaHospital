const fs = require('fs');

const html = fs.readFileSync('scripts/services.html', 'utf8');
const regex = /(?:data-src|src)=["'](https:\/\/geetahospitalmundra\.com\/wp-content\/uploads\/[^"']+)["']/gi;
let match;
const seen = new Set();
while ((match = regex.exec(html)) !== null) {
  if (!seen.has(match[1])) {
    seen.add(match[1]);
    console.log(match[1]);
  }
}
