const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');
const sections = html.split(/<section\s+/i);

console.log('=== SECTION 13 RAW ===');
console.log(sections[13]);

console.log('=== SECTION 16 RAW ===');
console.log(sections[16]);
