const fs = require('fs');

const html = fs.readFileSync('scripts/services.html', 'utf8');
const sections = html.split(/<section\s+/i);

function cleanText(str) {
  return str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
}

sections.forEach((sec, i) => {
  const imgs = [];
  const regex = /(?:data-src|src)=["'](https:\/\/geetahospitalmundra\.com\/wp-content\/uploads\/[^"']+)["']/gi;
  let m;
  while ((m = regex.exec(sec)) !== null) {
    if (!m[1].includes('Logo')) imgs.push(m[1]);
  }
  if (imgs.length > 0) {
    console.log(`\n=== Section ${i} ===`);
    console.log('Images:', imgs);
    console.log('Text:', cleanText(sec).slice(0, 300));
  }
});
