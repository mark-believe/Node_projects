
"use strict"
let uuid = 1;       // 仅测试不是一个标准的事例

// 模拟数据库, 在users内查找用户名
const users = {
    john: {
        id: 'john',
        password: 'password',
        name: 'John Doe'
    }
};

//登录
exports.login = async function (request, h){
   
    if (request.auth.isAuthenticated) {
        return h.redirect('/');
    }

    let message = '';
    let account = null;
 
    if (request.method === 'post') {
        if (!request.payload.username ||
            !request.payload.password) {
            message = 'Missing username or password';
        }
        else {
            account = users[request.payload.username];
            if (!account ||
                account.password !== request.payload.password) {
                message = 'Invalid username or password';
            }
        }
    }

    if (request.method === 'get' || message) {
 
        return h.view('login');
    }
 
    const sid = String(++uuid);
 
    await request.server.app.cache.set(sid, { account }, 0);
    // 必须在成功登录后调用才能开始会话。会话必须是非空对象，它基于request.auth.credentials中的成功后续身份验证进行设置
    request.cookieAuth.set({ sid });
 
    return h.redirect('/');
};

//注销
exports.logout = async function (request, h){
   
    request.server.app.cache.drop(request.state['sid-example'].sid);
    request.cookieAuth.clear();
    return h.redirect('/');
};
