


module.exports = function(io) {
const chart = require("../models/myChart");
var mongoChart =chart.method3;
var makeCSV =require('../models/exportMongoToCsv')
var getBigMLdata =require('../models/bigML')
var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('You on analytics')
  makeCSV();
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.render('pages/analytics')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About analytics: -> if you want know more give this student 100')
})


io.on("connection", function (socket) {
  console.log("analytics connected...");
  socket.on("clicked", function (name, what) {
    showAnalytics()
  })
  
})

// function showAnalytics() {
//   makeCSV(function callback() {
//     console.log("finish file")
//     getBigMLdata(function name(err,res) {
//       if(err){}
//       else{
//         console.log(res);
//       } 
//     });
//   });

// }

function showAnalytics() {
  getBigMLdata(function name(err,res) {
    if(err){}
    else{
      mongoChart(res,function (err, result) {
        if (err) {
          console.log(err);
        } else {
          io.emit("chartmongo", result);
        }
      })
      //io.emit("chartmongo",res);
    } 
  });
}

return router

}