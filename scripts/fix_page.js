const fs = require('fs');
const path = 'src/app/messages/page.tsx';
let data = fs.readFileSync(path, 'utf8');
data = data.replace(/\\`/g, '`');
data = data.replace(/\\\$/g, '$');
fs.writeFileSync(path, data);
console.log('Fixed page.tsx');
