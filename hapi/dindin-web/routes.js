'user strict'

const Pages = require('./handlers/pages');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: Pages.home
    },
    {
        path: '/{param*}',
        method: 'GET',
        handler: {
            directory: {
                path: '.',
                index: true,
            }
        }
    }
        

];
