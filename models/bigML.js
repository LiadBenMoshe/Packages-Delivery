var bigml = require('bigml');



var func=module.exports = function getBigMLdata(callback) {

var connection = new bigml.BigML(
  "LIAD4444",
  "0c98cae75b57ff4e460f17b6ffd8410e721264d2"
);

console.log("hii",__dirname)
var source = new bigml.Source(connection);
source.create('./mongodb_fastcsv.csv', function(error, sourceInfo) {
    if (!error && sourceInfo) {
        var dataset = new bigml.Dataset(connection);
        dataset.create(sourceInfo, function(error, datasetInfo) {
        dataset.get(datasetInfo.resource,function (error, resource) {
            if (!error && resource) {
             var ans=[]
             var itemsets=resource.object.fields["000002"].summary.categories;
             var num=resource.object.rows;
             //console.log(ans,"%");
             //console.log(itemsets[0][1]);
             for(var i=0;i<itemsets.length;i++){
                 var element ={}
                 element.items=itemsets[i][0];
                 element.times=itemsets[i][1];
                 element.accuracy=((itemsets[i][1]/num)*100).toFixed(3);
                 //console.log(Object.values(element));
                 ans.push(Object.values(element));
             }
             callback(null,ans)
            } 
        });  
               
        });
      }
});

}

// func(function back(err,res) {
//     if(err){}
//     else{
//         console.log(res[0][0]);
//     }
// });

