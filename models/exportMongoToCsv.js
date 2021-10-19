const mongodb = require("mongodb").MongoClient;
const fastcsv = require("fast-csv");
const fs = require("fs");


module.exports=function makeCSVfromMongo() {
  
const ws = fs.createWriteStream("mongodb_fastcsv.csv");
const url =
  "mongodb+srv://liad:123qwe@cluster0.mcnun.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongodb.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;

    client
      .db("boxDelivery")
      .collection("items")
      .find({})
      .toArray((err, data) => {
        if (err) throw err;

        fastcsv
          .write(data, { headers: true })
          .on("finish", function () {
            console.log("Write to mongodb_fastcsv.csv successfully!");
          })
          .pipe(ws);
          
        client.close();
        
      });
  }
);

}
