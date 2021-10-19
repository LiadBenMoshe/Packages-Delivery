var QrCode = require('qrcode-reader');
var fs = require('fs');
var Jimp = require("jimp");


module.exports= function QrReader(namePng,callback) {
    

var buffer = fs.readFileSync(__dirname+'/'+namePng);

    Jimp.read(buffer, function(err, image) {
    if (err) {
        console.error(err);
        // TODO handle error
    }
    var qr = new QrCode();
    qr.callback = function(err, value) {
        if (err) {
            console.error(err);
            // TODO handle error
        }
        //console.log(value.result);
        callback(null,value.result);
        
        
    };
    qr.decode(image.bitmap);

    })

    

}


    
