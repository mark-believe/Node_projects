'use strict';

const Hapi = require('hapi');
const HAPIWebSocket = require("hapi-plugin-websocket")

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(HAPIWebSocket);

    server.route({
        method: "POST",
        path: "/foo",
        options: {
            plugins: {
                websocket: {
                    only: true,
                    autoping: 10 * 1000,
                    //subprotocol: "foo/1.0",
                    initially: true,
                    connect: ({ ctx, wss, ws, req, peers }) => {
                        console.log('connected!!!!');
                        //
                        //ws.send(...)
                        //...
                    },
                    disconnect: ({ ctx, wss, ws, req, peers }) => {
                        console.log('disconnected!!!!');
                        //...
                    }
                }
            }
        },
        handler: async (request, h) => {
            let { mode, ctx, wss, ws, req, peers, initially } = request.websocket();
            console.log(request.payload);
            //...
        }
    });
    /*  provide combined REST/WebSocket route  */
    server.route({
        method: "POST", path: "/bar",
        config: {
            payload: { output: "data", parse: true, allow: "application/json" },
            plugins: { websocket: true }
        },
        handler: (request, h) => {
            let { mode } = request.websocket()
            return { at: "bar", mode: mode, seen: request.payload }
        }
    })
    server.route({
        method: "POST", path: "/quux",
        config: {
            response: { emptyStatusCode: 204 },
            payload: { output: "data", parse: true, allow: "application/json" },
            //auth: { mode: "required", strategy: "basic" },
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
                    },
                    disconnect: ({ ctx }) => {
                        if (ctx.to !== null) {
                            clearTimeout(this.ctx)
                            ctx.to = null
                        }
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

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();