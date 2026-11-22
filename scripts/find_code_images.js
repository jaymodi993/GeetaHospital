const fs = require('fs');
const path = require('path');

function findImages(file) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /['"](\/images\/[^'"]+)['"]/g;
  const matches = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    matches.push(m[1]);
  }
  return [...new Set(matches)];
}

const files = [
  'src/data/hospitalData.ts',
  'src/components/home/HomeClient.tsx',
  'src/app/about/page.tsx',
  'src/components/doctors/DoctorsClient.tsx',
  'src/app/services/page.tsx',
  'src/components/gallery/GalleryClient.tsx',
  'src/components/contact/ContactClient.tsx',
  'src/components/layout/Navbar.tsx',
  'src/components/layout/Footer.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    console.log('\n=== ' + f + ' ===');
    findImages(f).forEach(img => console.log('  ', img));
  }
});
