const Boom = require("boom")
const HAPI = require("hapi")
const HAPIWebSocket = require("hapi-plugin-websocket")
const HAPIAuthBasic = require("hapi-auth-basic")
const WebSocket = require("ws")
const Pack = require('package')

const Joi = require('joi');

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

(async () => {
    /*  create new HAPI service  */
    const server = new HAPI.Server({ address: "127.0.0.1", port: 8080 })

    /*  register HAPI plugins  */
    await server.register([
        HAPIWebSocket,
        HAPIAuthBasic,
        require('inert'),
        require('vision'),
        {
            plugin: require('hapi-swagger'),
            options: swaggerOptions
        }])

    /*  register Basic authentication stategy  */
    server.auth.strategy("basic", "basic", {
        validate: async (request, username, password, h) => {
            let isValid = false
            let credentials = null
            if (username === "foo" && password === "bar") {
                isValid = true
                credentials = { username }
            }
            return { isValid, credentials }
        }
    })

    /*  provide plain REST route  */
    server.route({
        method: "POST", path: "/foo",
        config: {
            tags: ['api','test'],
            payload: { output: "data", parse: true, allow: "application/json" },
            validate:{
                payload: Joi.object({
                    username:Joi.string().required().description('用户名'),
                    password:Joi.string().required().description('密码'),
                })
            }
        },
        handler: (request, h) => {
            return { at: "foo", seen: request.payload }
        },


    })

    /*  provide combined REST/WebSocket route  */
    server.route({
        method: "POST", path: "/bar",
        config: {
            tags: ['api','test'],
            payload: { output: "data", parse: true, allow: "application/json" },
            plugins: { websocket: true }
        },
        handler: (request, h) => {
            let { mode } = request.websocket()
            return { at: "bar", mode: mode, seen: request.payload }
        }
    })

    /*  provide exclusive WebSocket route  */
    server.route({
        method: "POST", path: "/baz",
        config: {
            tags: ['api','test'],
            plugins: { websocket: { only: true, autoping: 30 * 1000 } }
        },
        handler: (request, h) => {
            return { at: "baz", seen: request.payload }
        }
    })

    /*  provide full-featured exclusive WebSocket route  */
    server.route({
        method: "POST", path: "/quux",
        config: {
            tags: ['api','test'],
            response: { emptyStatusCode: 204 },
            payload: { output: "data", parse: true, allow: "application/json" },
            auth: { mode: "required", strategy: "basic" },
            plugins: {
                websocket: {
                    only: true,
                    initially: true,
                    subprotocol: "quux/1.0",
                    connect: ({ ctx, ws }) => {
                        ctx.to = setInterval(() => {
                            if (ws.readyState === WebSocket.OPEN)
                                ws.send(JSON.stringify({ cmd: "PING" }))
                        }, 5000)
                        console.log("Client connected!!!!");
                    },
                    disconnect: ({ ctx }) => {
                        if (ctx.to !== null) {
                            clearTimeout(this.ctx)
                            ctx.to = null
                        }
                        console.log("Client disconnected!!!!");
                    }
                }
            }
        },
        handler: (request, h) => {
            let { initially, ws } = request.websocket()
            if (initially) {
                ws.send(JSON.stringify({ cmd: "HELLO", arg: request.auth.credentials.username }))
                return ""
            }
            if (typeof request.payload !== "object" || request.payload === null)
                return Boom.badRequest("invalid request")
            if (typeof request.payload.cmd !== "string")
                return Boom.badRequest("invalid request")
            if (request.payload.cmd === "PING")
                return { result: "PONG" }
            else if (request.payload.cmd === "AWAKE-ALL") {
                var peers = request.websocket().peers
                peers.forEach((peer) => {
                    peer.send(JSON.stringify({ cmd: "AWAKE" }))
                })
                return ""
            }
            else
                return Boom.badRequest("unknown command")
        }
    })

    /*  provide exclusive framed WebSocket route  */
    server.route({
        method: "POST", path: "/framed",
        config: {
            tags: ['api','test'],
            plugins: {
                websocket: {
                    only: true,
                    autoping: 30 * 1000,
                    frame: true,
                    frameEncoding: "json",
                    frameRequest: "REQUEST",
                    frameResponse: "RESPONSE"
                }
            }
        },
        handler: (request, h) => {
            return { at: "framed", seen: request.payload }
        }
    })

    /*  start the HAPI service  */
    await server.start()
    console.log(`Server running at: ${server.info.uri}`);
})().catch((err) => {
    console.log(`ERROR: ${err}`)
})
//https://www.cnblogs.com/hf8051/p/4792200.html
//test command
/*
# start the sample server implementation (see source code above)
$ node sample-server.js &

# access the plain REST route via REST
$ curl -X POST --header 'Content-type: application/json' \
  --data '{ "foo": 42 }' http://127.0.0.1:12345/foo
{"at":"foo","seen":{"foo":42}}

# access the combined REST/WebSocket route via REST
$ curl -X POST --header 'Content-type: application/json' \
  --data '{ "foo": 42 }' http://127.0.0.1:12345/bar
{"at":"bar","mode":"http","seen":{"foo":42}}

# access the exclusive WebSocket route via REST
$ curl -X POST --header 'Content-type: application/json' --data '{ "foo": 42 }' http://127.0.0.1:12345/baz
{"statusCode":400,"error":"Bad Request","message":"HTTP request to a WebSocket-only route not allowed"}

# access the combined REST/WebSocket route via WebSocket
$ wscat --connect ws://127.0.0.1:12345/bar
> { "foo": 42 }
< {"at":"bar","mode":"websocket","seen":{"foo":42}}
> { "foo": 7 }
< {"at":"bar","mode":"websocket","seen":{"foo":7}}

# access the exclusive WebSocket route via WebSocket
$ wscat --connect ws://127.0.0.1:12345/baz
> { "foo": 42 }
< {"at":"baz","seen":{"foo":42}}
> { "foo": 7 }
< {"at":"baz","seen":{"foo":7}}

# access the full-featured exclusive WebSocket route via WebSockets
$ wscat --subprotocol "quux/1.0" --auth foo:bar --connect ws://127.0.0.1:12345/quux
< {"cmd":"HELLO",arg:"foo"}
> {"cmd":"PING"}
< {"result":"PONG"}
> {"cmd":"AWAKE-ALL"}
< {"cmd":"AWAKE"}
< {"cmd":"PING"}
< {"cmd":"PING"}
< {"cmd":"PING"}
< {"cmd":"PING"}

# access framed exclusive WebSocket route
$ wscat --connect ws://127.0.0.1:12345/framed
< [ 42, 0, "REQUEST", { "foo": 7 } ]
> [1,42,"RESPONSE",{"at":"framed","seen":{"foo":7}}]
*/