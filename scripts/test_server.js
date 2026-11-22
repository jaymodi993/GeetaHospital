const http = require('http');

function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          length: data.length,
          containsCampIvf: data.includes('camp-ivf.jpg'),
          containsCampEnt: data.includes('camp-ent.jpg'),
          containsDrKundan: data.includes('dr-kundan-modi.jpg'),
          containsCardio: data.includes('camp-cardiology.jpg')
        });
      });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

Promise.all([
  check('http://127.0.0.1:4000/doctors'),
  check('http://127.0.0.1:4000/gallery')
]).then(res => console.log(JSON.stringify(res, null, 2)));
