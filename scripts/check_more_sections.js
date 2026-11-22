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

for (let i = 17; i < sections.length; i++) {
  const s = sections[i];
  if (s.includes('Dr.') || s.includes('Dr ') || s.includes('Doctor') || s.includes('Specialist') || s.includes('Camp') || s.includes('CAMP')) {
    const cols = s.split(/class="elementor-column\s+/i);
    console.log(`\n=================== SECTION ${i} (${cols.length} columns) ===================`);
    for (let c = 0; c < cols.length; c++) {
      const col = cols[c];
      const text = cleanText(col);
      const img = col.match(/(?:data-src|src)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/i);
      console.log(`--- Col ${c} ---`);
      if (img) console.log('Image:', img[1]);
      console.log('Text:', text.slice(0, 300));
    }
  }
}
