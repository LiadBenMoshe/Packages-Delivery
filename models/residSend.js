
//https://medium.com/geekculture/using-redis-with-docker-and-nodejs-express-71dccd495fd3



var qaGen=require('./qrGenerator')
const redis = require('redis');
const redisClient = redis.createClient(6379,'127.0.0.1');




module.exports= function sendToRedis(key,data){ 



data=JSON.stringify(data) //parse the object to json string

redisClient.on('error', (err) => {
    console.log('Error occured while connecting or accessing redis server');
});

//set a new data with new key
redisClient.set(key,data);



redisClient.publish('notification', JSON.stringify(data), 
function(){
    console.log(" send from redis ");
    qaGen(JSON.parse(data));
});

///
//redisClient.del('customer_name4');


// get the data by enter a key
redisClient.get(key,function (err, obj) {
    obj=JSON.parse(obj) // parse the json string to object
    console.log(obj);
});
    
}
