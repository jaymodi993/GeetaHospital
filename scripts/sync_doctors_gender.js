const fs = require('fs');

let code = fs.readFileSync('src/data/hospitalData.ts', 'utf8');

const genders = {
  'dr-kundan-modi': 'male',
  'dr-vinod-prajapati': 'male',
  'dr-avani-modi': 'female',
  'dr-rahul-patel': 'male',
  'dr-omkarsinh-chudasama': 'male',
  'dr-shailesh-chauhan': 'male',
  'dr-tahira-imam': 'female',
  'dr-gautam-aniyaliya': 'male',
  'dr-krupa-nath': 'female',
  'dr-jaydatt-tekani': 'male',
  'dr-naushad-ravjani': 'male',
  'dr-yogesh-patel': 'male',
  'dr-krushnakumar-virda': 'male',
  'dr-ankur-dhanani': 'male',
  'dr-rajesh-punjabi': 'female',
  'dr-binal-trivedi': 'female',
  'dr-anvay-gandhi': 'female'
};

for (const [id, gen] of Object.entries(genders)) {
  const target = `id: "${id}",`;
  if (code.includes(target) && !code.includes(`id: "${id}",\n    gender:`)) {
    code = code.replace(target, `${target}\n    gender: "${gen}",`);
  }
}

fs.writeFileSync('src/data/hospitalData.ts', code, 'utf8');
console.log('Successfully synced genders in src/data/hospitalData.ts');
