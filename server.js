const express = require("express");
const app = express();
const socketIO = require("socket.io");
const residGet = require("./models/redisGet");
const GetArrivePack = require("./models/readFromFirebase");
const redis = require("redis");
const sendToMongo =require("./models/sendToMongo")
const chartSize = require("./models/myChart");
const chartWithSize = chartSize.method;
const chartWithCountry = chartSize.method2;

const subscriber = redis.createClient(6379, "127.0.0.1");

const port = 3000;

const mapOfDist = new Map();
initMap(mapOfDist);

var haifa = {
  size: { small: 0, medium: 0, big: 0 },
  country: {
    Russia: 0,
    England: 0,
    Italy: 0,
    China: 0,
    UnitedStates: 0,
    Germany: 0,
    Netherlands: 0,
    Turkey: 0,
    Thailand: 0,
    India: 0,
    Spain: 0,
  },
};
var dan = {
  size: { small: 0, medium: 0, big: 0 },
  country: {
    Russia: 0,
    England: 0,
    Italy: 0,
    China: 0,
    UnitedStates: 0,
    Germany: 0,
    Netherlands: 0,
    Turkey: 0,
    Thailand: 0,
    India: 0,
    Spain: 0,
  },
};
var center = {
  size: { small: 0, medium: 0, big: 0 },
  country: {
    Russia: 0,
    England: 0,
    Italy: 0,
    China: 0,
    UnitedStates: 0,
    Germany: 0,
    Netherlands: 0,
    Turkey: 0,
    Thailand: 0,
    India: 0,
    Spain: 0,
  },
};
var eilat = {
  size: { small: 0, medium: 0, big: 0 },
  country: {
    Russia: 0,
    England: 0,
    Italy: 0,
    China: 0,
    UnitedStates: 0,
    Germany: 0,
    Netherlands: 0,
    Turkey: 0,
    Thailand: 0,
    India: 0,
    Spain: 0,
  },
};
var north = {
  size: { small: 0, medium: 0, big: 0 },
  country: {
    Russia: 0,
    England: 0,
    Italy: 0,
    China: 0,
    UnitedStates: 0,
    Germany: 0,
    Netherlands: 0,
    Turkey: 0,
    Thailand: 0,
    India: 0,
    Spain: 0,
  },
};
var south = {
  size: { small: 0, medium: 0, big: 0 },
  country: {
    Russia: 0,
    England: 0,
    Italy: 0,
    China: 0,
    UnitedStates: 0,
    Germany: 0,
    Netherlands: 0,
    Turkey: 0,
    Thailand: 0,
    India: 0,
    Spain: 0,
  },
};

app.use(express.static("public"));
app.use(express.static("assets"));


app.set("view engine", "ejs");

app.get("/", (req, res) => {
  var data = {
    cards: [
      {
        districtId: "haifa",
        title: "חיפה",
        value: mapOfDist.get("haifa"),
        unit: ".חבילות שנשלחו",
        fotterIcon: "",
        fotterText: "נפח ממוצע",
        icon: "local_shipping",
        color: "danger",
        arrive: mapOfDist.get("haifaArrive"),
        arriveId: "Haifa",
      },
      {
        districtId: "dan",
        title: "דן",
        value: mapOfDist.get("dan"),
        unit: ".חבילות שנשלחו",
        fotterIcon: "",
        fotterText: "נפח ממוצע",
        icon: "local_shipping",
        color: "success",
        arrive: mapOfDist.get("danArrive"),
        arriveId: "Dan",
      },

      {
        districtId: "center",
        title: "מרכז",
        value: mapOfDist.get("center"),
        unit: ".חבילות שנשלחו",
        fotterIcon: "",
        fotterText: "נפח ממוצע",
        icon: "local_shipping",
        color: "info",
        arrive: mapOfDist.get("centerArrive"),
        arriveId: "Center",
      },

      {
        districtId: "south",
        title: "דרום",
        value: mapOfDist.get("south"),
        unit: ".חבילות שנשלחו",
        fotterIcon: "",
        fotterText: "נפח ממוצע",
        icon: "local_shipping",
        color: "warning",
        arrive: mapOfDist.get("southArrive"),
        arriveId: "South",
      },

      {
        districtId: "eilat",
        title: "אילת",
        value: mapOfDist.get("eilat"),
        unit: ".חבילות שנשלחו",
        fotterIcon: "",
        fotterText: "נפח ממוצע",
        icon: "local_shipping",
        color: "dark",
        arrive: mapOfDist.get("eilatArrive"),
        arriveId: "Eilat",
      },

      {
        districtId: "north",
        title: "צפון",
        value: mapOfDist.get("north"),
        unit: ".חבילות שנשלחו",
        fotterIcon: "",
        fotterText: "נפח ממוצע",
        icon: "local_shipping",
        color: "primary",
        arrive: mapOfDist.get("northArrive"),
        arriveId: "North",
      },
    ],
  };
  res.render("pages/dashboard", data);
});


const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);
const analytics = require("./routers/analytics")(io);
app.use("/analytics", analytics);

//listen to redis massage boker , every time he gets a box data
subscriber.on("message", function (channel, message) {
  //console.log('Message: ' + message + ' on channel: ' + channel + ' is arrive!');
  var data = JSON.parse(message);
  var json = JSON.parse(data); //the object with all the data
  //console.log(json)
  sendToMongo(json);//send to mongoDB in Atlas
  updateDist(json); // update thr HOT data
  var district = json.dist.toLowerCase();
  mapOfDist.set(district, mapOfDist.get(district) + 1);
  io.emit("announcements", json.dist); //sent the district by use socket.io
});
subscriber.subscribe("notification");

// redisGet(testKey,function(err, result){
//   if(err) {console.log(err); }
//   else {
//      console.log(result);
//   }
// });

//deploy Chart
io.on("connection", function (socket) {
  console.log("Client connected...");
  //socket.emit('announcements', mapOfDist);
  socket.on("clicked", function (name, what) {
    if (name == "Haifa") {
      callToChart(haifa, what);
    } else if (name == "Dan") {
      callToChart(dan, what);
    } else if (name == "Center") {
      callToChart(center, what);
    } else if (name == "Eilat") {
      callToChart(eilat, what);
    } else if (name == "South") {
      callToChart(south, what);
    } else if (name == "North") {
      callToChart(north, what);
    }
  });
});

function callbackforarrive(err, result) {
  if (err) {
    console.log("err");
  } else {
    for (var i = 0; i < result.length; i++) {
      var arrive = result[i].toLowerCase() + "Arrive";
      mapOfDist.set(arrive, mapOfDist.get(arrive) + 1); //update the map
    }
    console.log("Arrive from firebase", result);
    io.emit("firebase", result); //send the arrive pack
  }
}
//every 30 second read from firebase an update
setInterval(GetArrivePack, 15000, callbackforarrive);

function initMap(map1) {
  map1.set("haifa", 0);
  map1.set("dan", 0);
  map1.set("center", 0);
  map1.set("south", 0);
  map1.set("eilat", 0);
  map1.set("north", 0);
  map1.set("haifaArrive", 0);
  map1.set("danArrive", 0);
  map1.set("centerArrive", 0);
  map1.set("southArrive", 0);
  map1.set("eilatArrive", 0);
  map1.set("northArrive", 0);
}

function updateDist(data) {
  var tSize = data.size;
  var tPlace = data.from;
  if (data.dist.toLowerCase() == "haifa") {
    haifa.size[tSize]++;
    haifa.country[tPlace]++;
  } else if (data.dist.toLowerCase() == "dan") {
    dan.size[tSize]++;
    dan.country[tPlace]++;
  } else if (data.dist.toLowerCase() == "south") {
    south.size[tSize]++;
    south.country[tPlace]++;
  } else if (data.dist.toLowerCase() == "center") {
    center.size[tSize]++;
    center.country[tPlace]++;
  } else if (data.dist.toLowerCase() == "eilat") {
    eilat.size[tSize]++;
    eilat.country[tPlace]++;
  } else if (data.dist.toLowerCase() == "north") {
    north.size[tSize]++;
    north.country[tPlace]++;
  }
}

function callToChart(dist, what) {
  if (what) {
    chartWithSize(dist, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        io.emit("chart", result);
      }
    });
  } else {
    chartWithCountry(dist, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        io.emit("chart", result);
      }
    });
  }
}


