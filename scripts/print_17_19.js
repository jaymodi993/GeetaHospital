const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');
const sections = html.split(/<section\s+/i);
function cleanText(str) {
  return str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
}
for (let i = 16; i < sections.length; i++) {
  console.log(`\n=== Section ${i} ===`);
  console.log(cleanText(sections[i]).slice(0, 500));
}
