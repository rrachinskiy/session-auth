const fs = require('fs');

const distFolder = './dist';

fs.rmdir(
  distFolder,
  {
    recursive: true,
  },
  error => {
    if (error) {
      console.log(error);
    } else {
      console.log(`[done]: Dist folder "${distFolder}" has been deleted`);
    }
  },
);
