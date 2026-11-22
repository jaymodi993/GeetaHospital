const fs = require('fs');
const cms = JSON.parse(fs.readFileSync('src/data/hospitalCmsData.json', 'utf8'));

let ts = fs.readFileSync('src/data/hospitalData.ts', 'utf8');

for (const doc of cms.doctors) {
  const targetId = 'id: "' + doc.id + '"';
  const idx = ts.indexOf(targetId);
  if (idx !== -1) {
    const imgIdx = ts.indexOf('image:', idx);
    const endLineIdx = ts.indexOf('\n', imgIdx);
    if (imgIdx !== -1 && endLineIdx !== -1 && imgIdx - idx < 1000) {
      const line = ts.substring(imgIdx, endLineIdx);
      const newLine = 'image: "' + doc.image + '",';
      ts = ts.substring(0, imgIdx) + newLine + ts.substring(endLineIdx + 1);
    }
  }
}

fs.writeFileSync('src/data/hospitalData.ts', ts, 'utf8');
console.log('Successfully updated DOCTORS in hospitalData.ts!');
