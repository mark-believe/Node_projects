"use strict"

exports.hello = function (request, h){

    return h.file('./public/hello.html');
};

exports.home = function (request, h){

    return h.file('./public/index.html');
};