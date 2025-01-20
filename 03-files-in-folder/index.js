const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error( err.message);
    return;
  }

  files.forEach((stats) => {
    if (stats.isFile()) {
      const filePath = path.join(dirPath, stats.name); 
      const fileName = (stats.name).split('.')[0];
      const fileExtName = path.extname(filePath).slice(1);
      
       fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err.message);
          return;
        }
        
        console.log(`${fileName} - ${fileExtName} - ${stats.size} bytes`);
      });
    }
  });
});
