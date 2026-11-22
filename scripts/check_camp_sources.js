const fs = require('fs');

const files = fs.readdirSync('scripts');
files.forEach(f => {
  if (f.endsWith('.html')) {
    const content = fs.readFileSync('scripts/' + f, 'utf8');
    if (content.includes('1.31.22-PM')) {
      console.log('1.31.22-PM found in', f);
    }
    if (content.includes('1.32.35-PM')) {
      console.log('1.32.35-PM found in', f);
    }
  }
});
