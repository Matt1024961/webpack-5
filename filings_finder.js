const fs = require('fs');
const testFolder = './src/assets';
const glob = require("glob");


(() => {
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    });

    var getDirectories = function (src, callback) {
        glob(src + '/**/Data.json', callback);
    };
    getDirectories(testFolder, function (err, res) {
        if (err) {
            console.log('Error', err);
        } else {
            console.log(res);
        }
    });
})();