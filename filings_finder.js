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
      //console.log(filing[`ixv:ixdsFiles`]);
      // console.log(current);
      // url resembles:
      // /src/assets/example-1/Data.json
      // we want the final url to resemble:
      // /assets/example-1/aapl-20211225.htm


      if (filing[`ixv:ixdsFiles`].length > 1) {
        const urls = filing[`ixv:ixdsFiles`].map((single) => {
          console.log(single);
          return `${current.substring(0, current.length - 9).slice(5)}${single}`;
        });
        console.log(urls);
        objectToWriteToFile.multi.push(urls);
      } else {
        objectToWriteToFile.single.push(`${current.substring(0, current.length - 9).slice(5)}${filing[`ixv:ixdsFiles`]}`);
      }
    });
    let data = JSON.stringify(objectToWriteToFile);
    fs.writeFileSync(`${filingsFolder}/development-locations.json`, data);
  });
})();
