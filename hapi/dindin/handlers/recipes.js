'use strict'

exports.find =  function (request, reply){
    let sql = 'SELECT * FROM recipes';
    const params = [];

    if(request.query.cuisine)
    {
        sql += ' WHERE cuisine = ?';
        params.push(request.query.cuisine);
    }
    this.db.all(sql,params,(err,results) => {

        if(err){
    
            throw err;
        }
        
        reply(results);
    });
};

exports.findOne = function (request, reply){
    this.db.get('SELECT * FROM recipes WHERE id = ?',
    [request.params.id],
    (err,reuslt) => {
        if(err) {
            throw err;
        }

        if(typeof reuslt !== 'undefined'){
            return reply(reuslt);
        }
        
        return reply('Net found').code(404);
    });
}