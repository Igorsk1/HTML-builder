const fs = require('fs').promises;
const path = require('path');
const srcDirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');

async function copyDir(src, copy) {
  try {
    await fs.rm(copy, { recursive: true, force: true });
    await fs.mkdir(copy, { recursive: true });
    const files = await fs.readdir(src, { withFileTypes: true });
    
      for (const file of files) {
      const srcFilePath = path.join(src, file.name);
      const copyFilePath = path.join(copy, file.name);
      if (file.isFile()) {
        await fs.copyFile(srcFilePath, copyFilePath);
      } else if (file.isDirectory()) {
        await copyDir(srcFilePath, copyFilePath);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}
 
copyDir(srcDirPath, copyDirPath);