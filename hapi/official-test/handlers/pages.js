"use strict"
const Dao = require('../utility/dao');

exports.hello = async function (request, h){

    return h.file('./views/hello.html');
};

//首页
exports.home = async function (request, h){

    const data = await Dao.findAll(request, "test");
        
    return h.view('index',{
        recipes: data
    })
};

//详情页
exports.viewRecipe = async function (request, h){
    
    const querystring = {
        id: Number(request.params.id)   //此处必须进行强制转换
    }

    const data = await Dao.findAll(request, "test",querystring);
        
    return h.view('index',{
        recipes: data
    })
};
