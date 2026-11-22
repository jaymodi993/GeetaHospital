const http = require('http');

async function run() {
  console.log("=== Geeta Hospital CMS & Upload API Verification Suite ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name}`);
      failed++;
    }
  }

  // Helper for HTTP requests
  async function httpRequest(url, options = {}, body = null) {
    return new Promise((resolve, reject) => {
      const u = new URL(url);
      const req = http.request(
        {
          hostname: u.hostname,
          port: u.port,
          path: u.pathname + u.search,
          method: options.method || 'GET',
          headers: options.headers || {},
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              text: data,
              json: () => {
                try {
                  return JSON.parse(data);
                } catch (e) {
                  return null;
                }
              },
            });
          });
        }
      );
      req.on('error', reject);
      if (body) {
        req.write(body);
      }
      req.end();
    });
  }

  // Test 1: GET /api/admin/content
  console.log("\n[Test 1] GET /api/admin/content");
  const res1 = await httpRequest('http://localhost:4000/api/admin/content');
  assert(res1.status === 200, "Content API returns HTTP 200");
  const data1 = res1.json();
  assert(data1 && data1.success === true, "Response JSON has success: true");
  assert(data1.data && data1.data.hospitalProfile, "CMS data contains hospitalProfile");
  assert(Array.isArray(data1.data.doctors) && data1.data.doctors.length >= 17, "CMS data contains all 17 doctors");
  assert(Array.isArray(data1.data.services) && data1.data.services.length >= 18, "CMS data contains all 18 services");
  assert(Array.isArray(data1.data.partners) && data1.data.partners.length >= 19, "CMS data contains all 19 partners");
  assert(Array.isArray(data1.data.gallery) && data1.data.gallery.length >= 27, "CMS data contains all 27 gallery items");

  // Test 2: POST /api/admin/content (Save Changes)
  console.log("\n[Test 2] POST /api/admin/content (Save Changes)");
  const updatedPayload = {
    ...data1.data,
    hospitalProfile: {
      ...data1.data.hospitalProfile,
      name: "Geeta Hospital",
      tagline: "Leading Multi-Speciality Healthcare in Mundra & Kutch",
      logoUrl: data1.data.hospitalProfile?.logoUrl || "/images/logo.png",
      faviconUrl: data1.data.hospitalProfile?.faviconUrl || "/favicon-32.png",
    },
  };
  const body2 = JSON.stringify(updatedPayload);
  const res2 = await httpRequest(
    'http://localhost:4000/api/admin/content',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body2),
      },
    },
    body2
  );
  assert(res2.status === 200, "POST Content returns HTTP 200");
  const data2 = res2.json();
  assert(data2 && data2.success === true, "POST Content JSON has success: true");

  // Test 3: POST /api/admin/upload with small mock image file
  console.log("\n[Test 3] POST /api/admin/upload (Small image file)");
  const boundary = '----WebKitFormBoundaryTest123456';
  const mockImage = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
  let multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\ntest-upload\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test-mock.gif"\r\nContent-Type: image/gif\r\n\r\n`),
    mockImage,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const res3 = await httpRequest(
    'http://localhost:4000/api/admin/upload',
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': multipartBody.length,
      },
    },
    multipartBody
  );
  assert(res3.status === 200, "Upload API returns HTTP 200 for valid image");
  const data3 = res3.json();
  assert(data3 && data3.success === true, "Upload response has success: true");
  assert(data3.url || data3.dataUrl, "Upload returns a valid URL or dataUrl");

  // Test 4: POST /api/admin/upload with oversized mock file (> 3.8MB)
  console.log("\n[Test 4] POST /api/admin/upload (Oversized protection > 3.8MB)");
  const bigBuffer = Buffer.alloc(4 * 1024 * 1024, 0); // 4MB
  let bigMultipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\nlogo\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="oversized.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
    bigBuffer,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const res4 = await httpRequest(
    'http://localhost:4000/api/admin/upload',
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bigMultipartBody.length,
      },
    },
    bigMultipartBody
  );
  assert(res4.status === 400, "Upload rejects oversized file with HTTP 400");
  const data4 = res4.json();
  assert(data4 && data4.success === false, "Oversized file response has clean JSON error");

  // Test 5: GET / (Homepage)
  console.log("\n[Test 5] GET / (Homepage)");
  const res5 = await httpRequest('http://localhost:4000/');
  assert(res5.status === 200, "Homepage returns HTTP 200");
  assert(res5.text.includes("Geeta Hospital"), "Homepage contains hospital name");

  // Test 6: GET /admin
  console.log("\n[Test 6] GET /admin (Admin Panel)");
  const res6 = await httpRequest('http://localhost:4000/admin');
  assert(res6.status === 200, "Admin page returns HTTP 200");
  assert(res6.text.includes("Admin"), "Admin page contains admin content");

  console.log("\n========================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("========================================================");

  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
