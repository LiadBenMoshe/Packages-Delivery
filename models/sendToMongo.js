const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://liad:123qwe@cluster0.mcnun.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";
const client = new MongoClient(uri);

// The database to use
const dbName = "boxDelivery";

var start =module.exports= async function sendToMongo(box) {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    // Use the collection "items"
    const col = db.collection("items");

    // Insert a single document
    const p = await col.insertOne(box);

    // const options = {
    //     // sort returned documents in ascending order by title (A->Z)
    //     sort: { title: 1 },
    //     // Include only the `title` and `imdb` fields in each returned document
    //     projection: { _id: 0 },
    // };

    // // Find one document
    // const cursor = await col.find({},options);
    // // Print to the console
    // await cursor.forEach(console.log);

    // col.deleteMany({}, function(err, obj) {
    //     if (err) throw err;
    //     console.log(obj.result + " document(s) deleted");
    //     client.close();
    //   });
    
    
  } catch (err) {
    console.log(err.stack);
  } finally {
    //await client.close();
  }

}

