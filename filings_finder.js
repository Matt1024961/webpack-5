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
      console.log(`ERROR Finding any Filings`);
    }
    files.forEach((current) => {
      let rawdata = fs.readFileSync(current);
      let filing = JSON.parse(rawdata);
      if (filing[`ixv:ixdsFiles`].length > 1) {
        const urls = filing[`ixv:ixdsFiles`].map((single) => {
          return `${current
            .substring(0, current.length - 9)
            .slice(5)}${single}`;
        });
        objectToWriteToFile.multi.push(urls);
      } else {
        objectToWriteToFile.single.push(
          `${current.substring(0, current.length - 9).slice(5)}${
            filing[`ixv:ixdsFiles`]
          }`
        );
      }
    });
    let data = JSON.stringify(objectToWriteToFile);
    fs.writeFileSync(`${filingsFolder}/development-locations.json`, data);
  });
})();
