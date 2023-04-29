const express = require('express');
const app = express()
// const PORT = process.env.PORT || 8080
const PORT = 8080
const cors = require('cors')
const path = require('path')
var admin = require("firebase-admin")
var serviceAccount = require("./key.json");
var mqtt = require('mqtt');
const http = require('http')
const Server = require('socket.io').Server
const serverless = require('serverless-http')
const { set , ref } = require('firebase-admin/database');
// const fb =require('firebase')
//=================================================================================\\
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin:'*'
    }
})
app.use(cors()); 
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb" , extended: true}));
app.use((req , res , next) => {
    res.setHeader('Access-Control-Allow-Origin',"*");
    next();
})
const _dirname = path.dirname("")
app.use(express.static(path.join(__dirname, "../frontend", "build")))
// app.get('/*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
// });
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build","index.html"),
    function(err) {
            if(err){
                res.status(500).send(err)
            }
    }
    );
});
app.listen(PORT, () => {
    // console.log('client',client)
    console.log(`Backend is listening at http://localhost:${PORT}`)
})

app.use('/static', express.static(path.join(__dirname, "build/static")));
app.use('/manifest.json', express.static(path.join(__dirname, "build", "manifest.json")));


//=================================================================================\\


// admin.initializeApp({
//     credential: admin.credential.cert
// })
// console.log(admin.database)
// var serviceAccount = require("firebase-adminsdk-9du5b@wherry-industrial-electronics.iam.gserviceaccount.com");
console.log(process.env.PORT)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wherry-industrial-electronics-default-rtdb.firebaseio.com"
});

const db = admin.firestore()
const rdb = admin.database()
// console.log(rdb.database)

var options = {
    // host: '3fe33b5f9a6a44298a9fe95c7b1d42d0.s2.eu.hivemq.cloud',
    host: 'broker.hivemq.com',
    // port: 8000,
    port: 8883,
    protocol: 'mqtts',
    // username: 'safhanalikhan@gmail.com',
    // password: 'display:none{',
    // protocolId: 'MQIsdp',
    // protocolVersion: 3  
}
var client = mqtt.connect("broker.hivemq.com",options);
// var mqtopic1 =  'MQTT1'
// setup the callbacks
client.on('connect', function () {
    console.log('Connected');
    var mqtopic1 = client.subscribe('1387/Statistics');
    // var mqtopic2 = client.subscribe('1410/Statistics');
    var mqtopic2 = client.subscribe('1400/Statistics');
    var mqtopic3 = client.subscribe('1199/Statistics');
    // var mqtopic1 = client.subscribe('MQTT1');
    // console.log('testtopic ==========>>>>' , mqtopic1)
    // console.log('testtopic ==========>>>>' , mqtopic2)
    // console.log('testtopic ==========>>>>' , mqtopic3)
});
client.on('close', function () {
    console.log('Disconnected')
})
client.on('disconnect', function (packet) {
    console.log(packet)
})
client.on('offline', function () {
    console.log('offline')
})

// function addDataInRTF(data){
//     request({
//     url: "https://wherry-industrial-electronics-default-rtdb.firebaseio.com",
//     method: "PUT",
//     json: data
//     }, function (err, res, body) {
//     console.log(body);
//     });
// }

client.on('message', function (topic, payload, packet) {
//     // Payload is Buffer
    console.log(`Topic: ${topic}, Message: ${payload.toString()}, QoS: ${packet.qos}`)

    

    // console.log('===================================================================')
    let Topic = topic;
    let Payload = JSON.parse(payload);
    // console.log('Payload===================================>' , Payload.d.Time)

    let Qos = packet.qos;
    let data = {Topic}
    rdb.ref(`machines/${Topic}`).set(data)
    // try{
    //     var respon = set(ref(rdb, 'machines/' + data.Topic), data)
    //     console.log(respon)
    // }
    // catch (error) {
    //     console.log('fire error =------=------=>>', error)
    // }
    // .then(_r => {
    //     // res.status(201).send({
    //     //     success: true,
    //     //     insertedId: data,
    //     // });
    //  })
    //  .catch(err => {
    //     res.status(420).send(err);
    //  });

    // let jdata = JSON.parse(payload)
    // addDataInRTF(Payload)
    // const response = rdb.collection('Machines').doc('mqtt').set(data)
    // console.log(response)
    // let payloadData = JSON.parse(payload)
    // app.post('/sendMachineData', function(req, res) {    
    //     // console.log('kaam ho gaya')
    //     res.send(data);
    //     console.log('kaam ho gaya',data)
    // });

})
client.on('reconnect', function () {
    console.log('Reconnecting...')
})

client.on('error', function (error) {
    console.log(error);
});

// client.on('message', function (topic, message) {
//     // called each time a message is received
//     console.log('Received message:', topic.toString() , message.toString());
//     // let data = message.toString();
//     // data = JSON.parse(data)
//     // console.log('data =====>>>>',data)    
//     // app.post('/sendMachineData', function(req, res) {    
//     //     res.send('reciveData');
//     // });

//     // saveData(data)
// });

module.exports.handler = serverless(app)

















// ========================================== MQTT SECTION =========================================== \\

// var options = {
//     // host: '3fe33b5f9a6a44298a9fe95c7b1d42d0.s2.eu.hivemq.cloud',
//     host: 'broker.hivemq.com',
//     // port: 8000,
//     port: 8883,
//     protocol: 'mqtts',
//     // username: 'safhanalikhan@gmail.com',
//     // password: 'display:none{',
//     // protocolId: 'MQIsdp',
//     // protocolVersion: 3  
// }
// var client = mqtt.connect("broker.hivemq.com",options);

// client.on('connect', function () {
//     console.log('Connected');
//     var mqtopic1 = client.subscribe('MQTT1');
//     // console.log('testtopic ==========>>>>' , mqtopic1)
// });

// client.on('reconnect', function () {
//     console.log('Reconnecting...')
// })

// client.on('error', function (error) {
//     console.log(error);
// });

// client.on('close', function () {
//     console.log('Disconnected')
// })

// client.on('disconnect', function (packet) {
//     console.log(packet)
// })

// client.on('offline', function () {
//     console.log('offline')
// })  
// client.on('message', function (topic, message , payload , packet) {
//     // Payload is Buffer
//     // var mess = message.toString();
//     var mydata = {
//         topic: topic.toString() ,
//         message : message.toString() ,
//         payload : payload ,
//         // packet : Packet
//     }
//     // console.log(JSON.parse(mydata))
//     // console.log('mydata========>>>>>' , mydata , '<<<<<=============mydata' )
//     // console.log('Received message:', topic.toString() , 'message' , message.toString() , 'payload' , payload , packet.qos);
    
// })
  