'use strict'

const Hapi = require('hapi');

const server = Hapi.server({
    port:3000,
    host:'localhost',
    routes:{
        files: {
            relativeTo: path.join(__dirname,'public')
        }
    }
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
    await server.register(require('vision'));

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views',
        isCached: false
    });

    server.route(require('./routes'));
    server.start();
    console.log('Server listening at:', server.info.uri);
}

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

process.on('close', (err) => {
	console.log(err);
});

init();