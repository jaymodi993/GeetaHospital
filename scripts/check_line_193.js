const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');
const lines = html.split('\n');
for (let i = Math.max(0, 185); i < Math.min(lines.length, 205); i++) {
  console.log(`[Line ${i}]:`, lines[i].slice(0, 200));
}
