const express = require('express')
const app = express();
const socketIO = require('socket.io');
const residGet = require('./models/redisGet');
var redis = require('redis');
const redisGet = require('./models/redisGet');
var subscriber = redis.createClient(6379,'127.0.0.1');


const mapOfDist = new Map();
initMap(mapOfDist);


const port=3000;

app.use(express.static('public'))
app.use(express.static('assets'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  var data = {
    cards: [
      {districtId:"haifa", title: "חיפה", value: mapOfDist.get('haifa'), unit: "חבילות בדרך", fotterIcon: "", fotterText: "נפח ממוצע", icon: "content_copy" ,color:"danger"},
      {districtId:"dan", title: "דן", value:mapOfDist.get('dan'), unit: "חבילות בדרך", fotterIcon: "", fotterText: "נפח ממוצע", icon: "store" ,color:"success"},

      {districtId:"center", title: "מרכז", value: mapOfDist.get('center'), unit: "חבילות בדרך", fotterIcon: "", fotterText: "נפח ממוצע", icon: "info_outline" ,color:"info"},

      {districtId:"south", title: "דרום", value:mapOfDist.get('south'), unit: "חבילות בדרך", fotterIcon: "", fotterText: "נפח ממוצע", icon: "add_shopping_cart",color:"warning" }
    ]
  }
  res.render("pages/dashboard", data)
})






app.get('/setData/:districtId/:value', function (req, res) {
  io.emit('newdata',{districtId:req.params.districtId,value:req.params.value})
  res.send(req.params.value)
})


const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);



var i=2;
subscriber.on('message', function (channel, message) {
  //console.log('Message: ' + message + ' on channel: ' + channel + ' is arrive!');
  var data=JSON.parse(message);
  var json=JSON.parse(data) //the object with all the data

  //a func that get a key connect to redis and return value
  redisGet(json.uid,function(err, result){ 
  if(err) {console.log(err); }
  else {
    // console.log(result);    
  }
  });
  var district=json.dist.toLowerCase();
  mapOfDist.set(district,mapOfDist.get(district)+1);
  io.emit('announcements', json.dist); //sent the district by use socket.io

 });
subscriber.subscribe('notification');


var testKey='6e108f41-d87e-4796-ba04-e46e4480ad15';

// redisGet(testKey,function(err, result){ 
//   if(err) {console.log(err); }
//   else {
//      console.log(result);    
//   }
// });



io.on('connection', function(socket) {
  console.log('Client connected...');
  //socket.emit('announcements', mapOfDist);

});


function initMap(map1){
map1.set('haifa', 0);
map1.set('dan', 0);
map1.set('center', 0);
map1.set('south',0);
}




