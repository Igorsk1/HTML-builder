const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

async function mergeStyles() {
  const styles = path.join(__dirname, 'styles');
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'));
  const outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
  const writeStream = fs.createWriteStream(outputFilePath);
  const files = await fsPromises.readdir(styles, { withFileTypes: true });
  
  for (const file of files) {
    const fileExtName = path.extname(file.name);

    if (file.isFile() && fileExtName === '.css') {
      const styleFilePath = path.join(styles, file.name);
      const readStream = fs.createReadStream(styleFilePath, 'utf-8');
      
      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });
    }
  }
}

mergeStyles();