var uuid=require('uuid');
var qaGen=require('./qrGenerator')
var uploadFile = require('./upload2FB');
const residSend = require('./residSend');
const timer = ms => new Promise(res => setTimeout(res, ms))



async function simulator(numOfsimulator){

var items=["socks", "lighter", "keychain", "BBQ", "headlamp", "hat", "watch", "necklace", "earring", "coffee-mug", "ashtray", "computer-screen", "bedding", "Harry-Potter-poster", "lamp", "puzzle", "haircut-machine", "guitar", "phone-cover", "phone-charger","Dragon"];

var sizeBox=["big","medium","small"];

var fee=["yes","no"];

var district=["Haifa","Dan","Center","South","Eilat","North"];

var country=["Russia", "England", "Italy", "China", "UnitedStates", "Germany", "Netherlands", "Turkey", "Thailand", "India", "Spain"];

//generate new pakage
for(let i=0;i<numOfsimulator;i++){
    let data={
        uid:uuid.v4(),
        items:[items[Math.floor(Math.random() * items.length)],items[Math.floor(Math.random() * items.length)]],
        size:sizeBox[Math.floor(Math.random() * sizeBox.length)],
        feeTax:fee[Math.floor(Math.random() * fee.length)],
        from:country[Math.floor(Math.random() * country.length)],
        dist:district[Math.floor(Math.random() * district.length)]

    }
    //make qaCode picture
    
    residSend(data.uid,data);
    
    
    

    await timer(2000);//wait 9 sec until the next pakage
}

}



setInterval(simulator, 5000,10); //simulate every 10 second
//simulator(10);//start the simulator with num of pakage you want


