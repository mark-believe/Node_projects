const Boom = require("boom")
const HAPI = require("hapi")
// const HAPIWebSocket = require("hapi-plugin-websocket")
// const HAPIAuthBasic = require("hapi-auth-basic")
const WebSocket = require('nodejs-websocket')
const WebSocketIo = require('socket.io-client');

const Pack = require('package')

//const Joi = require('joi');

const swaggerOptions = {
    info: {
        title: 'Test-API',
        version: Pack.version,
        contact: {
            name: "Mark zhang",
            email: "love123zst@163.com",
            url: "http://localhost:3000"
        }
    },
    grouping: 'tags',
};


// const ws = require("nodejs-websocket")
// const net = require('net')

var clients_luck_show = new Array();
var clients_luck_control = new Array();
var clients_luck_client = new Array();
var datas = new Array();


// Scream server example: "hi" . "HI!!!"
// var server = ws.createServer(function (conn) {
//     conn.on("text", function (str) {
//         onData(str,conn);
//     })
//     conn.on("close", function (code, reason) {
//         onDisconnect();
//     })
// })
// server.listen(8000)
const init = async () => {
    /*  create new HAPI service  */
    const server = new HAPI.Server({ address: "127.0.0.1", port: 3000 })

    /*  register HAPI plugins  */
    await server.register([
        require('inert'),
        require('vision'),
        {
            plugin: require('hapi-swagger'),
            options: swaggerOptions
        }])

    //const wsServer = new WebSocket.Server({server});
    const wsServer = WebSocketIo(server);

    wsServer.on("connection", function(socket){
        console.log("server connecting");
        socket.on("clientMsg", (data)=>{
            console.log(data)
            socket.emit("serverMsg", "your message" + data);
        })
    });
    

    // wsServer.on('connection',function(ws){
    //     // ws.on('message',function connection(message){
    //     //     console.log('received:%d',message);
    //     // });
    //     ws.on("text", function (str) {
    //         onData(str,conn);
    //     })
    //     ws.on("close", function (code, reason) {
    //         onDisconnect();
    //     })
    //     ws.send('Connected!!!');
    // })


    /*  start the HAPI service  */
    await server.start()
    console.log(`Server running at: ${server.info.uri}`);
}

init();

function onDisconnect() {
    console.log("connect close");
    clients_luck_show.length = 0;
    clients_luck_control.length = 0;
    clients_luck_client.length = 0;
}

function onData(data, conn) {
    console.log("data=" + data);

    //conn.sendText(str);
    var json = JSON.parse(data);
    switch (json.action) {
        case "reg":
            regClient(JSON.parse(data), conn);
            break;
        case "luckcontrol":
            sendtoclient(clients_luck_show, json, data);
            sendtoclient(clients_luck_client, json, data);
            break;
        case "luckok":
            sendtoclient(clients_luck_show, json, data);
            break;
        case "luckend":
            sendtoclient(clients_luck_show, json, data);
            sendtoclient(clients_luck_control, json, data);
            sendtoclient(clients_luck_client, json, data);
            break;

    }
}

function regClient(json, conn) {
    var id = conn.key;
    datas[id] = json.showid;
    switch (json.type) {
        case "luck_show":
            clients_luck_show[conn.key] = conn;
            break;
        case "luck_client":
            clients_luck_client[conn.key] = conn;
            break;
        case "luck_control":
            clients_luck_control[conn.key] = conn;
            break;
    }

    conn.sendText(json.type + "，注册成功");

}



function sendtoclient(clients, json, data) {
    console.log("---------------------------------------------------------");
    for (var key in clients) {
        var id = clients[key].key;
        if (datas[id] == json.showid) {
            clients[key].sendText(data);
            console.log("sendText=" + data);
        }
    }


}