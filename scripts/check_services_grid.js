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

for (let i = 4; i <= 13; i++) {
  if (sections[i]) {
    const cols = sections[i].split(/class="elementor-column\s+/i);
    console.log(`\n=================== Section ${i} ===================`);
    cols.forEach((col, c) => {
      if (c > 0) {
        const img = col.match(/(?:data-src|src)=["']([^"']+)["']/i);
        const heading = col.match(/<h\d[^>]*>(.*?)<\/h\d>/i);
        const p = col.match(/<p[^>]*>(.*?)<\/p>/i);
        console.log(`Col ${c}:`);
        if (img) console.log('  Image:', img[1]);
        if (heading) console.log('  Heading:', cleanText(heading[1]));
        if (p) console.log('  P:', cleanText(p[1]));
      }
    });
  }
}
