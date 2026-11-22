const http = require('http');

const images = [
  'dr-kundan-modi.jpg',
  'dr-vinod-prajapati.jpg',
  'dr-avani-modi.jpg',
  'dr-rahul-patel.jpg',
  'dr-omkarsinh-chudasama.jpg',
  'dr-shailesh-chauhan.jpg',
  'dr-tahira-imam.jpg',
  'dr-gautam-aniyaliya.jpg',
  'dr-krupa-nath.jpg',
];

function checkImage(img) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:4000/images/doctors/${img}`, (res) => {
      let bytes = 0;
      res.on('data', chunk => bytes += chunk.length);
      res.on('end', () => resolve({ img, status: res.statusCode, contentType: res.headers['content-type'], bytes }));
    }).on('error', err => resolve({ img, error: err.message }));
  });
}

Promise.all(images.map(checkImage)).then(results => {
  console.log(JSON.stringify(results, null, 2));
});
