const https = require('https');
const fs = require('fs');
const path = require('path');

const pages = [
  'https://geetahospitalmundra.com/',
  'https://geetahospitalmundra.com/about/',
  'https://geetahospitalmundra.com/doctors/',
  'https://geetahospitalmundra.com/services/',
  'https://geetahospitalmundra.com/gallery/',
  'https://geetahospitalmundra.com/contact/'
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const allImages = new Set();
  console.log('Fetching pages...');
  for (const page of pages) {
    try {
      console.log(`Fetching ${page}...`);
      const html = await fetchPage(page);
      const regex = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|svg)/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        const u = match[0];
        if (u.includes('geetahospitalmundra.com/wp-content/uploads/')) {
          allImages.add(u);
        }
      }
    } catch (e) {
      console.error(`Error fetching ${page}:`, e.message);
    }
  }

  const imageList = Array.from(allImages);
  console.log(`Found ${imageList.length} unique images from geetahospitalmundra.com.`);
  console.log(JSON.stringify(imageList, null, 2));

  // Save image list to json
  fs.writeFileSync(path.join(__dirname, 'images.json'), JSON.stringify(imageList, null, 2));
}

run();
