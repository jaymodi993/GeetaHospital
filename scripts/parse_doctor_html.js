const fs = require('fs');
const html = fs.readFileSync('scripts/doctors_page.html', 'utf8');

// Search for all image tags and their attributes
const imgMatches = html.matchAll(/<img[^>]+>/gi);
console.log('--- ALL IMG TAGS IN DOCTORS PAGE ---');
for (const im of imgMatches) {
  console.log(im[0]);
}

// Search for doctors
const doctorNames = ['Kundan', 'Vinod', 'Avani', 'Rahul', 'Jaydatt', 'Naushad', 'Binal', 'Ankur'];
for (const doc of doctorNames) {
  const pos = html.indexOf(doc);
  if (pos !== -1) {
    console.log(`\n=================== ${doc} ===================`);
    const slice = html.slice(Math.max(0, pos - 600), pos + 1000);
    // Find any image inside slice
    const imgsInSlice = slice.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi);
    console.log('Images near ' + doc + ':', imgsInSlice);
    // console.log(slice.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  }
}
