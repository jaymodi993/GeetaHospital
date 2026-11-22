const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');
const sections = html.split(/<section\s+/i);
console.log('Total sections in doctors_page.html:', sections.length);
for (let i = 10; i < sections.length; i++) {
  console.log(`Section ${i}: length = ${sections[i].length}, snippet = ${sections[i].slice(0, 100).replace(/\s+/g, ' ')}`);
}
