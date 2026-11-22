const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');

// The doctors page is built with Elementor. Let's find each Elementor widget/column that contains a doctor
// Look for sections or columns
const blocks = html.split(/elementor-widget-heading|elementor-column\s+/i);
console.log('Total blocks:', blocks.length);

for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i];
  if (b.includes('Dr.') || b.includes('Dr ')) {
    // Extract text
    const text = b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    // Extract img data-src
    const imgMatches = b.match(/data-src=["']([^"']+)["']/g) || b.match(/src=["']([^"']+)["']/g);
    console.log('\n--- BLOCK ' + i + ' ---');
    console.log('Text preview:', text.slice(0, 300));
    console.log('Images in block:', imgMatches);
  }
}
