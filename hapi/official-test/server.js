'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Config = require('./config/plugins');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const plugins = [
    Inert,
    Vision,
	{ plugin: require('hapi-mongodb'), options: Config.db }/*连接数据库*/
];

const init = async () => {

    await server.register(plugins);
    
    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views',
        layoutPath: './views/layout',
        layout: true,
        isCached: false,
        partialsPath: './views/partials'
    });

    server.route(require('./routes'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();