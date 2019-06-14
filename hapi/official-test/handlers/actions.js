'use strict'
const Dao = require('../utility/dao');

exports.login = function (request, reply) {
/*
    const apiUrl = this.apiBaseUrl + '/login';

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),
        json: true
    }, (err, res, payload) => {

        if (err) {
            throw err;
        }

        if (res.statusCode !== 200) {
            return reply.redirect(this.webBaseUrl + '/login');
        }

        request.cookieAuth.set({
            token: payload.token
        });
        reply.redirect(this.webBaseUrl);
    });
    */
    const querystring = {
        id: Number(request.params.id)   //此处必须进行强制转换
    }

    // /const data = await Dao.findAll(request, "test",querystring);

};
