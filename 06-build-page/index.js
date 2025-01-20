
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) {
    console.error(err.message);
  }
});

async function mergeStyles() {
  const styles = path.join(__dirname, 'styles');
  const outputStyleFile = path.join(projectDist, 'style.css');

  try {
    const writeStream = fs.createWriteStream(outputStyleFile);
    const cssFiles = await fsPromises.readdir(styles, { withFileTypes: true });
  
    cssFiles.forEach((file) => {
      const fileExtName = path.extname(file.name);

      if (file.isFile() && fileExtName === '.css') {
        const styleFilePath = path.join(styles, file.name);
        const readStream = fs.createReadStream(styleFilePath, 'utf-8');
        
        readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      }
    });
  } catch(err) {
    console.log(err.message);
  }
}

const srcAssets = path.join(__dirname, 'assets');
const copyAssets = path.join(projectDist, 'assets');

async function copyDir(src, copy) {
  try {
    await fsPromises.rm(copy, { recursive: true, force: true });
    await fsPromises.mkdir(copy, { recursive: true });
    const files = await fsPromises.readdir(src, { withFileTypes: true });
    
    for (const file of files) {
    const srcFilePath = path.join(src, file.name);
    const copyFilePath = path.join(copy, file.name);
    
    if (file.isFile()) {
      await fsPromises.copyFile(srcFilePath, copyFilePath);
    } else if (file.isDirectory()) {
      await copyDir(srcFilePath, copyFilePath);
    }
  }
  } catch (err) {
    console.log(err.message);
  }
}

async function createMarkup() {
  const templateFilePath = path.join(__dirname, 'template.html');
  const indexFilePath = path.join(projectDist, 'index.html');
  
  await fsPromises.copyFile(templateFilePath, indexFilePath);
  let indexFileContent = await fsPromises.readFile(indexFilePath, 'utf-8');

  const componentsPath =  path.join(__dirname, 'components');
  const components = await fsPromises.readdir(componentsPath, { withFileTypes: true });

  for (const file of components) {
    const filePath = path.join(componentsPath, file.name);
    const fileExtName = path.extname(file.name);

    if(file.isFile() && fileExtName === '.html') {
      const fileName = file.name.replace(fileExtName, '');
      const fileContent = await fsPromises.readFile(filePath, 'utf-8');
      indexFileContent = indexFileContent.replace(`{{${fileName}}}`, fileContent);
    }
  }

  await fsPromises.writeFile(indexFilePath, indexFileContent, 'utf-8');
}
 
function buildPage() {
  createMarkup();
  mergeStyles();
  copyDir(srcAssets, copyAssets);
}

buildPage();



