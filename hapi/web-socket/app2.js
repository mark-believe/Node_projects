'use strict';
const ws = require("nodejs-websocket")
const net = require('net')

var clients_luck_show = new Array();
var clients_luck_control = new Array();
var clients_luck_client = new Array();

// Scream server example: "hi" . "HI!!!"
var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        onData(str, conn);
    });

    conn.on("connect", function (code) {
        console.log('开启连接', code)
    });

    conn.on("close", function (code, reason) {
        onDisconnect();
    })

    conn.on('error', function (code) {
        console.log('异常关闭', code)
    })

})
server.listen(8000)


function onDisconnect() {
    console.log("connect close");
    clients_luck_show.length = 0;
    clients_luck_control.length = 0;
    clients_luck_client.length = 0;
}

function onData(data, conn) {
    console.log("data=" + data);
    return;

    //conn.sendText(str);
    var json = JSON.parse(data);
    if (!json)
        return;

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

var datas = new Array();
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