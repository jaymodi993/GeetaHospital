const http = require('http');
const fs = require('fs');

async function testAll() {
  console.log("=== Comprehensive Verification of All Image Upload Features ===");
  let passed = 0;
  let failed = 0;

  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  const initialLogoSize = fs.statSync("public/images/logo.png").size;
  const initialFaviconSize = fs.statSync("public/favicon-32.png").size;

  async function uploadImage(type, filename) {
    return new Promise((resolve, reject) => {
      const boundary = '----TestBoundary' + Date.now();
      // Generate a valid small PNG image buffer (1x1 red PNG)
      const pngBuffer = Buffer.from(
        '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c63f8cfc000000301010018dd8d6c0000000049454e44ae426082',
        'hex'
      );

      const parts = [
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\n${type}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n`),
        pngBuffer,
        Buffer.from(`\r\n--${boundary}--\r\n`),
      ];
      const body = Buffer.concat(parts);

      const req = http.request(
        {
          hostname: 'localhost',
          port: 4000,
          path: '/api/admin/upload',
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length,
          },
        },
        (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve({ status: res.statusCode, json });
            } catch (e) {
              resolve({ status: res.statusCode, error: data });
            }
          });
        }
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  // 1. Logo upload
  console.log("\n[Upload Test 1] Upload Main Logo");
  const up1 = await uploadImage("logo", "my-hospital-logo.png");
  assert(up1.status === 200, "Logo upload returns HTTP 200");
  assert(up1.json && up1.json.success === true, "Logo upload success: true");
  assert(up1.json && (up1.json.url || up1.json.dataUrl), "Logo upload returns valid URL");

  // 2. Favicon upload
  console.log("\n[Upload Test 2] Upload Favicon");
  const up2 = await uploadImage("favicon", "my-favicon.png");
  assert(up2.status === 200, "Favicon upload returns HTTP 200");
  assert(up2.json && up2.json.success === true, "Favicon upload success: true");
  assert(up2.json && (up2.json.url || up2.json.dataUrl), "Favicon upload returns valid URL");

  // 3. Hero banner upload
  console.log("\n[Upload Test 3] Upload Hero Banner");
  const up3 = await uploadImage("banner", "campus-banner.png");
  assert(up3.status === 200, "Banner upload returns HTTP 200");
  assert(up3.json && up3.json.success === true, "Banner upload success: true");
  assert(up3.json && (up3.json.url || up3.json.dataUrl), "Banner upload returns valid URL");

  // 4. Doctor photo upload
  console.log("\n[Upload Test 4] Upload Doctor Photo");
  const up4 = await uploadImage("doctor", "dr-specialist.png");
  assert(up4.status === 200, "Doctor photo upload returns HTTP 200");
  assert(up4.json && up4.json.success === true, "Doctor photo upload success: true");
  assert(up4.json && (up4.json.url || up4.json.dataUrl), "Doctor photo upload returns valid URL");

  // 5. Partner logo upload
  console.log("\n[Upload Test 5] Upload Partner Logo");
  const up5 = await uploadImage("partner", "insurance-partner.png");
  assert(up5.status === 200, "Partner logo upload returns HTTP 200");
  assert(up5.json && up5.json.success === true, "Partner logo upload success: true");
  assert(up5.json && (up5.json.url || up5.json.dataUrl), "Partner logo upload returns valid URL");

  // 6. Gallery photo upload
  console.log("\n[Upload Test 6] Upload Gallery Photo");
  const up6 = await uploadImage("gallery", "operation-theatre.png");
  assert(up6.status === 200, "Gallery upload returns HTTP 200");
  assert(up6.json && up6.json.success === true, "Gallery upload success: true");
  assert(up6.json && (up6.json.url || up6.json.dataUrl), "Gallery upload returns valid URL");

  // 7. Verify disk files are not corrupted
  console.log("\n[Asset Integrity Check]");
  const currentLogoSize = fs.statSync("public/images/logo.png").size;
  const currentFaviconSize = fs.statSync("public/favicon-32.png").size;
  assert(currentLogoSize === initialLogoSize, "Base logo.png remains intact and uncorrupted");
  assert(currentFaviconSize === initialFaviconSize, "Base favicon-32.png remains intact and uncorrupted");

  console.log("\n========================================================");
  console.log(`TOTAL UPLOAD TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("========================================================");

  if (failed > 0) process.exit(1);
}

testAll().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
