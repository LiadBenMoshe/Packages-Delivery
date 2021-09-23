//https://www.geeksforgeeks.org/generate-a-qr-code-in-node-js/

// Require the package
const QRCode = require('qrcode')
var uploadFile = require('./upload2FB');
var uuid=require('uuid');
const { GridFSBucket } = require('mongodb');


 




module.exports= function generetor(data){ 
// Converting the data into String format
let stringdata = JSON.stringify(data);

QRCode.toFile("./test1.png",stringdata, function (err, code) {
    if(err) return console.log("error occurred")
 
})


var uplodfile=new uploadFile();
uplodfile.uploadFile(data.uid+'.png');
}













 





