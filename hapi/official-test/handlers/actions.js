'use strict'
const Dao = require('../utility/dao');

//页面登录
exports.login = function (request, reply) {

    const querystring = {
        id: Number(request.params.id)   //此处必须进行强制转换
    }

};

//创建食谱
exports.createRecipe = function (request, h) {
    //const recipe = request.payload;
    const obj = {
        id: 1,
        stars: Number(0)
    };
    var newObj = Object.assign(obj, request.payload);
    Dao.save(request, "test", newObj);
    return h.redirect('/');
}
