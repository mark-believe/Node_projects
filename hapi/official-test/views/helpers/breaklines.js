'use strict'

const Handlebars = require('handlebars');

module.exports = function (text) {

    text = Handlebars.Utils.escapeExpression(text); //转义文本中的HTML
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');  //替换所有换行
    return new Handlebars.SafeString(text);         //返回新的安全字符串
};