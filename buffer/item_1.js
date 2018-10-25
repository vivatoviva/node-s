const fs = require('fs');
const file = fs.createReadStream('./file.md', { highWaterMark: 11 });
const data = [];
let size = 0;
file.on('data', (chunk) => {
  data.push(chunk);
  size += chunk.length;
});

file.on('end', () => {
  const buf = Buffer.concat(data, size);
  console.log(buf.toString());
});
