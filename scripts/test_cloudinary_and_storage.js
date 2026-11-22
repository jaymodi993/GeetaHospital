const http = require('http');

async function run() {
  console.log("=== Cloud Storage (Cloudinary) & Storage Reset Test Suite ===");
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

  async function api(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: 'localhost',
          port: 4000,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          },
        },
        (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, json: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        }
      );
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  // Test 1: GET /api/admin/storage
  console.log("\n[Test 1] GET /api/admin/storage (Get Storage Status)");
  const res1 = await api('/api/admin/storage');
  assert(res1.status === 200, "Storage status returns HTTP 200");
  assert(res1.json && res1.json.success === true, "Storage status has success: true");
  assert(res1.json && res1.json.settings !== undefined, "Storage settings object present");

  // Test 2: POST /api/admin/storage (action: test without credentials)
  console.log("\n[Test 2] POST /api/admin/storage (action: test)");
  const res2 = await api('/api/admin/storage', 'POST', { action: 'test' });
  assert(res2.status === 200, "Test action returns HTTP 200");
  assert(res2.json !== undefined, "Test response returned JSON");

  // Test 3: POST /api/admin/storage (action: clear-storage - ખાલી કરવા માટે)
  console.log("\n[Test 3] POST /api/admin/storage (action: clear-storage)");
  const res3 = await api('/api/admin/storage', 'POST', { action: 'clear-storage' });
  assert(res3.status === 200, "Clear storage returns HTTP 200");
  assert(res3.json && res3.json.success === true, "Clear storage success: true");
  assert(res3.json && typeof res3.json.message === "string", "Returns clear confirmation message");

  // Test 4: Verify CMS content reset after clear-storage
  console.log("\n[Test 4] GET /api/admin/content after clear-storage");
  const res4 = await api('/api/admin/content');
  assert(res4.status === 200, "Content API returns HTTP 200");
  assert(Boolean(res4.json.data.hospitalProfile.logoUrl), "Logo reset to valid baseline URL");
  assert(Boolean(res4.json.data.hospitalProfile.faviconUrl), "Favicon reset to valid baseline URL");

  console.log("\n========================================================");
  console.log(`TOTAL STORAGE TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("========================================================");

  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
