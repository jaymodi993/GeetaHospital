const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'jaymodi',
  api_key: '225697312197988',
  api_secret: 'b8yQCZX0iepW7yo3x1g7KJnfEjk',
  secure: true,
});

async function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("=== Migrating All Hospital Images to Cloudinary CDN ===");

  const imagesDir = path.join(process.cwd(), "public", "images");
  const allImageFiles = await getAllFiles(imagesDir);

  // Also include favicons
  const fav32 = path.join(process.cwd(), "public", "favicon-32.png");
  const fav192 = path.join(process.cwd(), "public", "favicon-192.png");
  if (fs.existsSync(fav32)) allImageFiles.push(fav32);
  if (fs.existsSync(fav192)) allImageFiles.push(fav192);

  console.log(`Discovered ${allImageFiles.length} total media assets to upload.\n`);

  const urlMap = {};
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allImageFiles.length; i++) {
    const filePath = allImageFiles[i];
    const relFromPublic = path.relative(path.join(process.cwd(), "public"), filePath).replace(/\\/g, "/");
    const webPath = "/" + relFromPublic; // e.g. /images/doctors/dr-kundan-modi.jpg

    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const subDir = path.dirname(relFromPublic); // e.g. images/doctors or images or .

    let folder = "geeta-hospital";
    if (subDir.includes("doctors")) {
      folder = "geeta-hospital/doctors";
    } else if (subDir.includes("partners")) {
      folder = "geeta-hospital/partners";
    } else if (subDir.includes("gallery")) {
      folder = "geeta-hospital/gallery";
    }

    process.stdout.write(`[${i + 1}/${allImageFiles.length}] Uploading ${webPath}... `);

    try {
      const uploadRes = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        public_id: baseName,
        overwrite: true,
        resource_type: "auto",
      });

      urlMap[webPath] = uploadRes.secure_url;
      console.log(`✓ DONE -> ${uploadRes.secure_url}`);
      successCount++;
    } catch (err) {
      console.log(`✗ FAILED: ${err.message}`);
      failCount++;
    }

    // Small delay between uploads
    await sleep(60);
  }

  console.log(`\nUpload complete! Success: ${successCount}, Failed: ${failCount}`);

  // Save mapping file
  const mapPath = path.join(process.cwd(), "src", "data", "cloudinaryImageMap.json");
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2), "utf8");
  console.log(`Saved mapping file to ${mapPath}`);

  // Update src/data/hospitalCmsData.json
  const cmsPath = path.join(process.cwd(), "src", "data", "hospitalCmsData.json");
  if (fs.existsSync(cmsPath)) {
    let cmsRaw = fs.readFileSync(cmsPath, "utf8");
    let replacedCount = 0;
    for (const [localUrl, cloudUrl] of Object.entries(urlMap)) {
      if (cmsRaw.includes(localUrl)) {
        cmsRaw = cmsRaw.split(localUrl).join(cloudUrl);
        replacedCount++;
      }
    }
    fs.writeFileSync(cmsPath, cmsRaw, "utf8");
    console.log(`Updated hospitalCmsData.json with ${replacedCount} Cloudinary URLs.`);
  }

  // Update src/data/hospitalData.ts
  const dataTsPath = path.join(process.cwd(), "src", "data", "hospitalData.ts");
  if (fs.existsSync(dataTsPath)) {
    let tsRaw = fs.readFileSync(dataTsPath, "utf8");
    let replacedCount = 0;
    for (const [localUrl, cloudUrl] of Object.entries(urlMap)) {
      if (tsRaw.includes(`"${localUrl}"`)) {
        tsRaw = tsRaw.split(`"${localUrl}"`).join(`"${cloudUrl}"`);
        replacedCount++;
      } else if (tsRaw.includes(`'${localUrl}'`)) {
        tsRaw = tsRaw.split(`'${localUrl}'`).join(`'${cloudUrl}'`);
        replacedCount++;
      }
    }
    fs.writeFileSync(dataTsPath, tsRaw, "utf8");
    console.log(`Updated hospitalData.ts with ${replacedCount} Cloudinary URLs.`);
  }

  console.log("\nAll images are now hosted on Cloudinary CDN!");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
