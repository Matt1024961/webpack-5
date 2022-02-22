const fs = require('fs');
const filingsFolder = './src/assets';
const glob = require('glob');

(() => {
  let objectToWriteToFile = {
    single: [],
    multi: [],
  };

  glob(`${filingsFolder}/**/Data.json`, {}, (error, files) => {
    if (error) {
    }
    files.forEach((current) => {
      let rawdata = fs.readFileSync(current);
      let filing = JSON.parse(rawdata);
      const htmlFiles = filing.facts
        .map((file) => {
          if (file[`ixv:files`]) {
            for (const i = 0; i < file[`ixv:files`].length; i++) {
              return file[`ixv:files`][i];
            }
          }
        })
        .filter(Boolean);

      const htmlUnique = Array.from(new Set(htmlFiles));

      if (htmlUnique.length > 1) {
        objectToWriteToFile.multi.push(htmlUnique);
      } else {
        objectToWriteToFile.single.push(htmlUnique);
      }
    });
    let data = JSON.stringify(objectToWriteToFile);
    fs.writeFileSync(`${filingsFolder}/development-locations.json`, data);
  });
})();
