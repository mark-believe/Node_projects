//随机生成字符串
exports.noceStr = function(num) {
	var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var maxPos = chars.length;
	var noceStr = "";
	for (var i = 0; i < num; i++) {
		noceStr = noceStr + chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return noceStr;
}

//随机生成字符串
exports.noceNum = function (num) {
	var chars = '0123456789';
	var maxPos = chars.length;
	var noceStr = "";
	for (var i = 0; i < num; i++) {
		noceStr = noceStr + chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return noceStr;
}

//校验手机号
exports.checkMobile = function checkMobile(sMobile) {
	if (sMobile.length != 11) {
		return false;
	}
	if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(sMobile))) {
		return false;
	}
	return true;
}

//校验手机号-promise
exports.checkMobilePromise = function checkMobilePromise(sMobile) {
	return new Promise((resolve, reject) => {
		if (sMobile.length != 11) {
			return reject('length error');
		}
		if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(sMobile))) {
			return reject('wrong number');
		}
		return resolve(true);
	})
}

//校验是否ObjectID
exports.checkObjectID = id =>{
	return new Promise((resolve,reject)=>{
		if(id.length === 24 && parseInt(id.toString().substring(0, 8), 16) > 1000000000){
			return resolve(true);
		}else{
			return resolve(false)
		}
	})
}

//校验是否ObjectID
exports.checkObjectIDOld = id =>id.length === 24 && parseInt(id.toString().substring(0, 8), 16) > 1000000000;