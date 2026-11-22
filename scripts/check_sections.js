const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');

// Let's find all elementor sections
const sectionMatches = html.split(/<section\s+/i);
console.log('Total sections in doctors page:', sectionMatches.length);

for (let s = 0; s < sectionMatches.length; s++) {
  const sec = sectionMatches[s];
  const docMatches = sec.match(/Dr\.?\s+[A-Za-z\s\.]+/g);
  const imgMatches = sec.match(/data-src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi);
  if (docMatches || imgMatches) {
    console.log(`\n================ SECTION ${s} ================`);
    console.log('Doctors in this section:', docMatches);
    console.log('Images in this section:', imgMatches);
  }
}
