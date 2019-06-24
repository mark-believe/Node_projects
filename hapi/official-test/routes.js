'user strict'

const Pages = require('./handlers/pages');
const Assets = require('./handlers/assets');
const Actions = require('./handlers/actions')
const Authentication  = require('./handlers/authentication');
const Joi = require('joi');

module.exports = [
    {
        method: ['GET', 'POST'], 
        path: '/login', 
        options: { 
            handler: Authentication.login, 
            auth: { mode: 'try' }, 
            plugins: { 'hapi-auth-cookie': { redirectTo: false } } ,
            tags: ['api','auth'], // ADD THIS TAG
            // validate:{
            //     params: {
            //         username: Joi.string().required().description('用户名'),
            //         password: Joi.string().required().description('密码')
            //     }
            // }
        } 
    },
    {
        method: 'GET', 
        path: '/logout', 
        handler: Authentication.logout,
        config: {
            tags: ['api','auth'],
            description: '退出'
        }
           
    },
    {
        method: 'GET',
        path: '/',
        handler: Pages.home,
        config: {
            tags: ['api'],
            description: '主页'
        }
    },
    {
        method: 'GET',
        path: '/data',
        handler: Pages.test,
        config: {
            tags: ['api'],
            description: '测试数据返回'
        }
    },
    {
        method: 'GET',
        path: '/recipes/{id}',
        handler: Pages.viewRecipe,
        config: {
            tags: ['api'],
            description: '获取菜谱',
            validate:{
                params: {
                    id: Joi.number().required().description('菜谱ID'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/create',
        handler: Pages.createRecipe,
        config: {
            tags: ['api'],
            description: '创建菜谱'
        }
    },
    {
        method: 'POST',
        path: '/create',
        handler: Actions.createRecipe,
        config: {
            tags: ['api'],
            description: '创建菜谱'
        }
    },
    {
        method: 'GET',
        path: '/hello',
        handler: Pages.hello,
        config: {
            tags: ['api'],
            description: '测试'
        }
    },  
    {
        method: 'GET',
        path: '/{param*}',
        options:{
            handler: Assets.servePublicDirectory,
            auth: { mode: 'try' },
            plugins: { 'hapi-auth-cookie': { redirectTo: false } } 
        }
        
    }

];
