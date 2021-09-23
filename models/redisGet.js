const redis = require('redis');
const redisClient = redis.createClient(6379,'127.0.0.1');

module.exports= function RedisGetFunc(key,callback){



redisClient.on('connect', function() {
  console.log('Connected!');
});

redisClient.get(key,function (err, obj) {
  obj=JSON.parse(obj) // parse the json string to object
  //console.log(obj);
  callback(null,obj);
});
} 