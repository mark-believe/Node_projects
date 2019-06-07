'use strict'

const Hapi = require('hapi');
const Sqilte3 = require('sqlite3');
const db = new Sqilte3.Database('./dindin.sqlite');

const server = new Hapi.Server();
server.connection({ port: 3000});

server.bind({db:db});

const validateFunc = function (token, callback){
    db.get('SELECT * FROM users WHERE token = ?',
    [token],
    (err,result) => {
        if(err) {
            return callback(err, false);
        }
        
        const user = result;

        if(typeof user == 'undefined'){
            return callback(null, false);
        }

        callback(null,true, {
            id: user.id,
            username: user.username
        })
    });
};

server.register(require('hapi-auth-bearer-token'), (err) => {
    if(err){
        throw err;
    }

    server.auth.strategy('api','bearer-access-token',{
        validateFunc: validateFunc
    })
});

server.route(require('./routes'));

server.start();
console.log('Server listening at:',server.info.uri);







/*
const Sqilte3 = require('sqlite3');

const db = new Sqilte3.Database('./dindin.sqilte');

db.all('SELECT * FROM recipes',(err,results) => {

    if(err){

        throw err;
    }

    for(let i=0; i<results.length; i++)
    {
        console.log(results[i].name);
    }
});
*/