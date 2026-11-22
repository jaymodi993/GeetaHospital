const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');
const $ = cheerio.load(html);

console.log('=== SECTIONS PARSING ===');

$('section').each((secIdx, sec) => {
  const text = $(sec).text().replace(/\s+/g, ' ').trim();
  if (text.includes('Dr.') || text.includes('DR.')) {
    console.log(`\n---------------- SECTION ${secIdx} ----------------`);
    
    // Find all columns or inner containers
    $(sec).find('.elementor-column').each((colIdx, col) => {
      const colText = $(col).text().replace(/\s+/g, ' ').trim();
      const imgs = [];
      $(col).find('img').each((i, img) => {
        imgs.push($(img).attr('src'));
      });
      
      const headings = [];
      $(col).find('h1, h2, h3, h4, h5, h6').each((i, h) => {
        headings.push($(h).text().trim());
      });
      
      if (headings.some(h => h.includes('Dr.')) || colText.includes('Dr.') || imgs.length > 0) {
        console.log(`\n  Col ${colIdx}:`);
        console.log(`    Headings:`, headings.join(' | '));
        console.log(`    Images:`, imgs.join(' | '));
        console.log(`    Text snippet:`, colText.slice(0, 200));
      }
    });
  }
});
