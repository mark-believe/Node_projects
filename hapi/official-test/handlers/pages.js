"use strict"
const Dao = require('../utility/dao');

exports.hello = async function (request, h){

    return h.file('./views/hello.html');
};

exports.home = async function (request, h){

    const recipes = [{
        id: 1,
        name: 'Silicate soup',
        cuisine: 'Martian',
        stars: 100,
        serves: 1,
        prep_time: '2 hours',
        cooking_time: '12 minutes'
    }, {
        id: 2,
        name: 'Methane trifle',
        cuisine: 'Neptunian',
        stars: 200,
        serves: 1,
        prep_time: '1 hours',
        cooking_time: '24 minutes'
    }];

    const data = await Dao.findAll(request, "test");
        
    return h.view('index',{
        recipes: data
    })
};