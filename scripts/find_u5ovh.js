const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('U5OVH-1')) {
    console.log(`Line ${i}:`, line.slice(0, 300));
  }
});
