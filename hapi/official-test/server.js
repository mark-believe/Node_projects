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
 
const init = async () => {
    
    //加载插件
    await server.register(plugins);


    const cache = server.cache({ segment: 'sessions', expiresIn:5 * 60 * 1000 });// ttl-以毫秒为单位设置cookie过期时间
    server.app.cache = cache;
 
    //验证机制
    server.auth.strategy('session', 'cookie', {
        password: 'password-should-be-32-characters',//cokie编码 应该至少32个字符长
        cookie: 'sid-example',  //默认名字
        redirectTo: '/login',// 可选的登录URI或函数（请求），返回URI以将未经身份验证的请求重定向。注意，它只会在“必需”身份验证模式时触发。要启用或禁用特定路由的重定向，请设置路由插件
        isSecure: false,    // 则允许通过不安全的连接传输cookie 默认true
        validateFunc: async (request, session) => { // 一个可选的会话验证函数，用于验证每个请求的会话cookie的内容。
 
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