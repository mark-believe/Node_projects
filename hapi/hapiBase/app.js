// app.js
const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');
const hello = require('./routes/hello');
const dbOperation = require('./routes/dbOperation')
const pluginHapiSwagger = require('./plugins/hapi-swagger');
const MongoClient = require('mongodb').MongoClient;
const server = new Hapi.Server();

// 配置服务器启动的 host 和端口
server.connection({
  host: config.host,
  port: config.port
})

server.bind({MongoClient,MongoClient});

const init = async () => {

    await server.register([
        // 为系统使用 hapi-swagger
        ...pluginHapiSwagger,
    ]);

    server.route([
        ...hello,
        ...dbOperation
    ])

    //初始化数据库
    //initDB();

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

init();