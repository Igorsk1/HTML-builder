const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Enter some text:');

rl.on("line", (input) => {
  if(input.toLowerCase().trim() === 'exit') {
    stream.close();
    rl.close();
  } else {
    stream.write(input + '\n'); 
  }
})

  process.on('SIGINT', () => {
    stream.close(); 
    rl.close(); 
});

process.on('exit', () => {
    console.log('file is closed');
});
