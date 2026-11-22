const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');

const sections = html.split(/<section\s+/i);

console.log('=== Section 4 Col 1 Full HTML ===');
const s4 = sections[4];
const cols = s4.split(/class="elementor-column\s+/i);
console.log(cols[1].slice(0, 1500));
