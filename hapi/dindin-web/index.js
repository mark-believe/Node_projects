'use strict'

const Hapi = require('hapi');

const server = Hapi.server({
    port:3000,
    host:'localhost'
});

server.bind({
    apiBaseUrl: 'http://localhost:4000/api',
    webBaseUrl: 'http://localhost:4000'
});

/*
server. require([
    require('dindin-api'),
    require('inert')
*/

const init = async () => {

    await server.register(require('inert'));
    server.route(require('./routes'));
    server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

init();