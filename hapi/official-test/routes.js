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
            tags: ['Authentication'],
            description: '退出'
        }
           
    },
    {
        method: 'GET',
        path: '/',
        handler: Pages.home,
        config: {
            tags: ['view'],
            description: '主页'
        }
    },
    {
        method: 'GET',
        path: '/recipes/{id}',
        handler: Pages.viewRecipe,
        config: {
            tags: ['operation'],
            description: '获取菜谱'
        }
    },
    {
        method: 'GET',
        path: '/create',
        handler: Pages.createRecipe,
        config: {
            tags: ['operation'],
            description: '获取菜谱'
        }
    },
    {
        method: 'POST',
        path: '/create',
        handler: Actions.createRecipe,
        config: {
            tags: ['operation'],
            description: '获取菜谱'
        }
    },
    {
        method: 'GET',
        path: '/hello',
        handler: Pages.hello,
        config: {
            tags: ['test'],
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
