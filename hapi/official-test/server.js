'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Hapi_new_auth_cookie = require('hapi-new-auth-cookie');

const Config = require('./config/plugins');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const plugins = [
    Inert,
    Vision,
    Hapi_new_auth_cookie,
	{ plugin: require('hapi-mongodb'), options: Config.db }/*连接数据库*/
];
let uuid = 1;       // Use seq instead of proper unique identifiers for demo only
 
const users = {
    john: {
        id: 'john',
        password: 'password',
        name: 'John Doe'
    }
};
 
const home = (request, h) => {
 
    return '<html><head><title>Login page</title></head><body><h3>Welcome ' +
      request.auth.credentials.name +
      '!</h3><br/><form method="get" action="/logout">' +
      '<input type="submit" value="Logout">' +
      '</form></body></html>';
};
 
 
const init = async () => {
    
    //加载插件
    await server.register(plugins);
    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
    server.app.cache = cache;
 
    //验证机制
    server.auth.strategy('session', 'cookie', {
        password: 'password-should-be-32-characters',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false,
        validateFunc: async (request, session) => {
 
            const cached = await cache.get(session.sid);
            const out = {
                valid: !!cached
            };
 
            if (out.valid) {
                out.credentials = cached.account;
            }
 
            return out;
        }
    });

    server.auth.default('session');

    //视图渲染配置
    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views',
        layoutPath: './views/layout',
        layout: true,
        isCached: false,
        partialsPath: './views/partials',
        helpersPath: './views/helpers'
    });

    //加载路由
    server.route(require('./routes'));
    //启动服务
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();