const fs = require('fs');

const html = fs.readFileSync('scripts/services.html', 'utf8');
const regex = /(?:data-srcset|srcset|href)=["']([^"']+)["']/gi;
let m;
const origs = new Set();
while ((m = regex.exec(html)) !== null) {
  if (m[1].includes('uploads/') && !m[1].includes('thumbs/')) {
    m[1].split(',').forEach(part => {
      const u = part.trim().split(' ')[0];
      if (u.includes('uploads/')) origs.add(u);
    });
  }
}

console.log('Original non-thumb images in services.html:');
Array.from(origs).forEach(u => console.log(u));
