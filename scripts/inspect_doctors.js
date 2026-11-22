const https = require('https');
const fs = require('fs');

https.get('https://geetahospitalmundra.com/doctors/', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scripts/doctors_page.html', data);

    // Extract all image tags
    const imgRegex = /<img[^>]+>/gi;
    let imgTag;
    const allImgs = [];
    while ((imgTag = imgRegex.exec(data)) !== null) {
      const srcMatch = imgTag[0].match(/src=["']([^"']+)["']/i);
      const altMatch = imgTag[0].match(/alt=["']([^"']*)["']/i);
      if (srcMatch) {
        allImgs.push({ src: srcMatch[1], alt: altMatch ? altMatch[1] : '' });
      }
    }
    console.log('Total images found on doctors page:', allImgs.length);
    console.log(JSON.stringify(allImgs, null, 2));
  });
}).on('error', console.error);
