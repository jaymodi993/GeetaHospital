const https = require('https');
const fs = require('fs');
const path = require('path');

const serviceImages = [
  {
    name: 'facility-pathology-lab.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/wOqhB-rvihyi3382rzh31zvdx6qpi9vf1gn3ir97dtltxfw8.jpg'
  },
  {
    name: 'facility-pharmacy.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/1KC7N-rvii2zrbvkxay0j5nbt0nkpk1owlf1cl7flc5f9q60.jpg'
  },
  {
    name: 'facility-gynec-ot.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/IxgZ3-rviiytklamhu2oassl38l1kg6e1122pdwyu85q2th4.jpg'
  },
  {
    name: 'facility-carm-ot.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/tr9L7-rvij1rscqwj8im0ikd02wsrjaxhi7vf1zkk3dzpby0.jpg'
  },
  {
    name: 'facility-nicu.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/Klker-rviis402i7b56w1oz6o4a8izid3p3v2dbr6ftm0zw8.jpg'
  },
  {
    name: 'facility-oxygen-pipeline.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/BELxR-rvii8sfi0suyjg41su07141vx8c2vud004f4ouobso.jpg'
  },
  {
    name: 'facility-usg.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/UGsph-rviic7kcw3jisd56tt8blqz9qph5w6xu51vqk3lr5k.jpg'
  },
  {
    name: 'facility-xray.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/JWj9U-rviifahbajrcuco2u56aryznu6ah4h65wav16r1arc.jpg'
  },
  {
    name: 'facility-ecg.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/i1ZnD-rviikqxkyx8a8uqpz03br3ezzpe6t7u2bb7ihky0mw.jpg'
  },
  {
    name: 'facility-insurance-desk.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/5yiWz-rviivck21nqp6jce2l1uvf456557mbx33s2nbx86go.jpg'
  },
  {
    name: 'facility-health-checkup.jpg',
    url: 'https://geetahospitalmundra.com/wp-content/uploads/elementor/thumbs/yHFth-rviio62fu7wuhrruzzbgbqcdt6j9tkewg8o4ctvfzs.jpg'
  }
];

function download(item) {
  return new Promise((resolve) => {
    const dest = path.join('public', 'images', item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, { rejectUnauthorized: false }, (response) => {
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(item.name + ' downloaded (' + response.statusCode + ')'); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      resolve(item.name + ' error: ' + err.message);
    });
  });
}

Promise.all(serviceImages.map(download)).then(results => {
  console.log(results.join('\n'));
});
