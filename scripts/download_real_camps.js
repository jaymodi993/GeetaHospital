const https = require('https');
const fs = require('fs');
const path = require('path');

const campImages = [
  {
    name: 'camp-womens-health.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2024-08-10-at-5.15.58-PM-2-qsii504rk2cst0w6h02w6r31d8xdwiz98rfdf7mgfs.jpeg'
  },
  {
    name: 'camp-cpr-training.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2024-08-10-at-5.15.57-PM-qsii4xb8zk8xu709xgv0h9snl3ba9fo28dgwzdqmyg.jpeg'
  },
  {
    name: 'camp-first-aid.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2024-08-10-at-5.15.54-PM-1-qsii4m16pjthyvgnrbzhncn4gguvp2fa6tn3827d14.jpeg'
  },
  {
    name: 'camp-health-seminar.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2024-08-10-at-5.15.58-PM-1-qsii4y936ea85sywrz9n1rk46h6nh4rski4egnp8s8.jpeg'
  }
];

function download(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join('public', 'images', item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, { rejectUnauthorized: false }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, { rejectUnauthorized: false }, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(item.name + ' downloaded (' + response.statusCode + ')'); });
        }).on('error', reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(item.name + ' downloaded (' + response.statusCode + ')'); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

Promise.all(campImages.map(download)).then(results => {
  console.log(results.join('\n'));
}).catch(err => console.error(err));
