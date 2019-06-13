"use strict"

exports.hello = function (request, h){

    return h.file('./views/hello.html');
};

exports.home = function (request, h){

    return h.file('./views/index.html');
};