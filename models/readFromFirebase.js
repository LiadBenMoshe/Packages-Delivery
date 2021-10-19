const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const express = require("express");
var ReadQr = require("./qrcodeReader");
const redis = require("redis");
const redisClient = redis.createClient(6379, "127.0.0.1");

const app = new express();

const storage = new Storage({
  keyFilename: "deliveries-4f46a-firebase-adminsdk-rqrol-2c98fbf543.json",
  //goto project settings (wheel at left top)
  //service accounts->click generate new private key
  //you will have a key file downloaded - copy to this folder
});

let bucketName = "gs://deliveries-4f46a.appspot.com";

const downloadFile = async (filename) => {
  let destFilename = filename;
  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };

  //Downloads the file
  //await storage.bucket(bucketName).file(filename).download(options);

  deleteFile(filename);//delete file from firebase

  // console.log(
  //   `gs://${bucketName}/${filename} downloaded to ${destFilename}.`
  // );
};

async function deleteFile(fileName) {
  await storage.bucket(bucketName).file(fileName).delete();

  console.log(`gs://${bucketName}/${fileName} deleted`);
}

module.exports = function getAndReadPack(callback) {

  var arr = [];
  var query = {
    directory: "",
  };

  storage
    .bucket(bucketName)
    .getFiles(query, function (err, files, nextQuery, apiResponse) {
      var dist = [];
      for (var i = 0; i < files.length; i++) {
        downloadFile(files[i].id);
        arr.push(files[i].id);
      }
      var bar = new Promise((resolve, reject) => {
        for (var i = 0; i < arr.length; i++) {
          var id = arr[i];
          id = id.substr(0, 36);
          redisClient.get(id, function (err, obj) {
            obj = JSON.parse(obj); // parse the json string to object
            //console.log(obj.dist);
            dist.push(obj.dist);
            if (i == arr.length) {
              resolve();
            }
            else{
              reject()
            }
          });
        }
      });
      bar.then(() => {
        callback(null, dist);
      }).catch(function () {
        console.log("Promise Rejected");
   });

    });
};

// getPackName(function(err, result){
//   if(err) {console.log('err'); }
//   else {
//      console.log(result);
//   }
// });



//app.listen(process.env.PORT || 8088, () => { console.log('node server running');})
