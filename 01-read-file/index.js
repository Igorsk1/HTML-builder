const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt')
const readStream = fs.createReadStream(filePath);

readStream.on('data', (chunk, err) => {
  if(err) throw new err;
   console.log(chunk.toString());
})