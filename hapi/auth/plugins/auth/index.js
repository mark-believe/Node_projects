'use strict';

const myPlugin = {
    name: 'myPlugin',
    version: '1.0.0',
    register: async function (server, options) {


        server.dependency(['bell'], (server,next) => {

            server.auth.strategy('facebook','beel', {
                
            })
        })
        // 创建一个路由作为示例

        server.route({
            method: 'GET',
            path: '/test',
            handler: function (request, h) {

                return 'hello, world';
            }
        });

        // etc ...
        await someAsyncMethods();
    }
};