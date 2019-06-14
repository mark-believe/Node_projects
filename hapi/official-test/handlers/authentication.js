
"use strict"
let uuid = 1;       // Use seq instead of proper unique identifiers for demo only
 
//登录
exports.login = async function (request, h){
   
    if (request.auth.isAuthenticated) {
        return h.redirect('/');
    }
 
    let message = '';
    let account = null;
 
    if (request.method === 'get' ||
        message) {
 
        return h.view('login');
    }
 
    const sid = String(++uuid);
 
    await request.server.app.cache.set(sid, { account }, 0);
    request.cookieAuth.set({ sid });
 
    return h.redirect('/');
};

//注销
exports.logout = async function (request, h){
   
    request.server.app.cache.drop(request.state['sid-example'].sid);
    request.cookieAuth.clear();
    return h.redirect('/');
};
