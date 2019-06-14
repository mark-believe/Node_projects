'user strict'

const Pages = require('./handlers/pages');
const Assets = require('./handlers/assets');
const Actions = require('./handlers/actions')
const Authentication  = require('./handlers/authentication');
        
module.exports = [
    {
        method: ['GET', 'POST'], 
        path: '/login', 
        options: { 
            handler: Authentication.login, 
            auth: { mode: 'try' }, 
            plugins: { 'hapi-auth-cookie': { redirectTo: false } } 
        } 
    },
    {
        method: 'GET', 
        path: '/logout', 
        handler: Authentication.logout   
    },
    {
        method: 'GET',
        path: '/',
        handler: Pages.home
    },
    {
        method: 'GET',
        path: '/recipes/{id}',
        handler: Pages.viewRecipe
    },
    {
        method: 'GET',
        path: '/create',
        handler: Pages.createRecipe
    },
    {
        method: 'POST',
        path: '/create',
        handler: Actions.createRecipe
    },
    {
        method: 'GET',
        path: '/hello',
        handler: Pages.hello
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
