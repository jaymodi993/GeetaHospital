const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images');

const imageMap = [
  // Logos
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/cropped-Logo.png',
    dest: 'logo.png'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/Logo-2.jpg',
    dest: 'logo-banner.jpg'
  },
  
  // Hospital Exterior & Campus
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/20170606_170202.jpg',
    dest: 'hospital-building.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2026/10/zOERU.jpg',
    dest: 'hero-banner-1.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2026/10/xTVyO.jpg',
    dest: 'hero-banner-2.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2026/10/boZwl.jpg',
    dest: 'hero-banner-3.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2026/10/U5OVH-1.jpg',
    dest: 'hero-banner-4.jpg'
  },

  // Real Hospital Facilities
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/ambulance-1.jpg',
    dest: 'ambulance-1.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/ambulance-2.jpg',
    dest: 'ambulance-2.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/ICU.jpeg',
    dest: 'icu-1.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/ICU2.jpeg',
    dest: 'icu-2.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/NICU-2.jpeg',
    dest: 'nicu-1.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/NICU.jpeg',
    dest: 'nicu-2.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/ortho-ot.jpeg',
    dest: 'ortho-carm-ot.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/OT-1.jpg',
    dest: 'operation-theatre-1.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/Labour-room.jpg',
    dest: 'labour-room.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/IMG_2774.jpg',
    dest: 'consultation-room-1.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/IMG_2759.jpg',
    dest: 'consultation-room-2.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/IMG_2760.jpg',
    dest: 'consultation-room-3.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/IMG_2768-scaled.jpg',
    dest: 'ultrasound-scanner.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/special-room-AC.jpg',
    dest: 'special-room-ac.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/GENARAL-ROOM.jpg',
    dest: 'general-ward.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/Stretcher-lift-2.jpg',
    dest: 'stretcher-lift.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/waiting-room-3.jpg',
    dest: 'waiting-room.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/frist-floor.jpg',
    dest: 'first-floor-corridor.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/gardan.jpg',
    dest: 'hospital-garden.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/2-floor.jpg',
    dest: 'second-floor.jpg'
  },

  // Certificates & Accreditations
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/rohini-new-2026_page-0001.jpg',
    dest: 'cert-rohini.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/BMW-NEW-2025.jpg',
    dest: 'cert-bmw.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/FIRE-NOC-02-YEAR_page-0001.jpg',
    dest: 'cert-fire-noc.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/PNDT-2025-1.jpg',
    dest: 'cert-pndt.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/GPCB-NEW_page-0001.jpg',
    dest: 'cert-gpcb-1.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/GPCB-NEW_page-0002.jpg',
    dest: 'cert-gpcb-2.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2026/10/ISrrf.jpg',
    dest: 'cert-registration.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2026/10/dv0rS.jpg',
    dest: 'cert-biomedical.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2026/10/FSCA_Geeta-Hospital-_Mundra-1_page-0001.jpg',
    dest: 'cert-fire-safety.jpg'
  },

  // Visiting Specialists Posters & Camps
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/WhatsApp-Image-2024-08-08-at-1.31.22-PM.jpeg',
    dest: 'camp-cardiology.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/WhatsApp-Image-2024-08-08-at-1.32.35-PM.jpeg',
    dest: 'camp-neurology.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-07-at-1.06.06-PM.jpeg',
    dest: 'camp-ivf.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-08-at-12.13.53-PM.jpeg',
    dest: 'camp-rheumatology.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-07-13-at-6.09.58-PM.jpeg',
    dest: 'camp-eye-sunday.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-07-13-at-6.09.59-PM.jpeg',
    dest: 'camp-ent.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-07-13-at-6.09.58-PM-3.jpeg',
    dest: 'camp-spine-neuro.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-07-13-at-6.09.59-PM-1.jpeg',
    dest: 'camp-laparoscopy.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-07-13-at-6.09.59-PM-2.jpeg',
    dest: 'camp-pediatric.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/WhatsApp-Image-2024-08-10-at-5.15.54-PM.jpeg',
    dest: 'hospital-ward-recovery.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/WhatsApp-Image-2024-08-10-at-5.15.55-PM.jpeg',
    dest: 'hospital-corridor-view.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/WhatsApp-Image-2024-08-10-at-5.15.56-PM.jpeg',
    dest: 'hospital-lab-view.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/WhatsApp-Image-2024-08-10-at-5.15.57-PM.jpeg',
    dest: 'hospital-emergency-bay.jpg'
  },
  {
    url: 'https://geetahospitalmundra.com/wp-content/uploads/2022/06/WhatsApp-Image-2024-08-10-at-5.15.58-PM.jpeg',
    dest: 'hospital-nursing-station.jpg'
  }
];

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Downloading ${imageMap.length} original images into ${targetDir}...`);
  let success = 0;
  let failed = 0;

  for (const item of imageMap) {
    const dest = path.join(targetDir, item.dest);
    try {
      process.stdout.write(`Downloading ${item.dest}... `);
      await download(item.url, dest);
      const stat = fs.statSync(dest);
      console.log(`OK (${Math.round(stat.size / 1024)} KB)`);
      success++;
    } catch (err) {
      console.log(`FAILED (${err.message})`);
      failed++;
    }
  }

  console.log(`\nFinished! Success: ${success}, Failed: ${failed}`);
}

run();
