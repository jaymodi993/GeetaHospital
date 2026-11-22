const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'images', 'doctors');
fs.readdirSync(dir).forEach(file => {
  const filePath = path.join(dir, file);
  const buf = fs.readFileSync(filePath);
  // Simple JPEG dimension parser
  let width = 0, height = 0;
  for (let i = 0; i < buf.length - 8; i++) {
    if (buf[i] === 0xFF && (buf[i+1] === 0xC0 || buf[i+1] === 0xC2)) {
      height = buf.readUInt16BE(i + 5);
      width = buf.readUInt16BE(i + 7);
      break;
    }
  }
  console.log(`${file}: ${width}x${height} (aspect: ${(width/height).toFixed(2)})`);
});
