//Inspiration: https://icodealot.com/convert-data-to-base64-in-nodejs/
const fs = require('fs');

module.exports = base64ToSvg;

function base64ToSvg(base64String){
    return new Buffer(base64String, 'base64').toString('ascii');
}

if (require.main === module) {
    // Started from commandline.
    console.log(base64ToSvg(process.argv[2]));
}