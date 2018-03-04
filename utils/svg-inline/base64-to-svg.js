//Inspiration: https://icodealot.com/convert-data-to-base64-in-nodejs/
const fs = require('fs');

module.exports = base64ToSvg;

function base64ToSvg(fileName){
    const data = fs.readFileSync(file);
    return new Buffer(data.toString(), 'base64').toString('ascii');
}

if (require.main === module) {
    // Started from commandline.
    console.log(base64ToSvg(process.argv[2]));
}