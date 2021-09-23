var uuid=require('uuid');
var qaGen=require('./qrGenerator')
var uploadFile = require('./upload2FB');
const residSend = require('./residSend');
const timer = ms => new Promise(res => setTimeout(res, ms))



async function simulator(numOfsimulator){

var items=["Socks", "lighter", "keychain", "BBQ", "headlamp", "hat", "watch", "necklace", "earring", "coffee mug", "ashtray", "computer screen", "bedding", "Harry Potter poster", "lamp", "puzzle", "haircut machine", "guitar", "phone cover", "phone charger","Dragon"];

var sizeBox=["big","medium","small"];

var fee=["yes","no"];

var district=["Haifa","Dan","Center","South"];

//generate new pakage
for(let i=0;i<numOfsimulator;i++){
    let data={
        uid:uuid.v4(),
        items:[items[Math.floor(Math.random() * items.length)],items[Math.floor(Math.random() * items.length)]],
        size:sizeBox[Math.floor(Math.random() * sizeBox.length)],
        feeTax:fee[Math.floor(Math.random() * fee.length)],
        dist:district[Math.floor(Math.random() * district.length)]

    }
    //make qaCode picture
    qaGen(data);
    residSend(data.uid,data);
    

    await timer(1000);//wait 9 sec until the next pakage
}

}


simulator(9);//start the simulator with num of pakage you want


