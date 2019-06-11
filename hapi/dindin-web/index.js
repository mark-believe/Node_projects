'use strict'

const Hapi = require('hapi');

const server = Hapi.server({
    port:3000,
    host:'lcoalhost'
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

server.register([
    /*require('dindin-api'),*/
    require('inert')
],(err) => {

    if(err) {
        throw err;
    }

    server.route(require('./routes'));

    server.start( () => {
        console.log('Started server at', server.info.uri);
    });



});