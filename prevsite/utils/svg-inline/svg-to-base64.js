//Inspiration: https://icodealot.com/convert-data-to-base64-in-nodejs/
const fs = require('fs');

module.exports = svgToBase64;

function svgToBase64(fileName){
    const data = fs.readFileSync(fileName);
    return data.toString('base64');
}

if (require.main === module) {
    // Started from commandline.
    console.log(svgToBase64(process.argv[2]));
}