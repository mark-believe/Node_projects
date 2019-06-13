/**
 * 数据库访问封装
 */

"use strict";
const Tools = require('./tools');
const Boom = require('boom');

/**
 * 查询某条数据
 * @param request 请求上下文
 * @param where 查询条件
 * @param isShow 不希望查询某些字段如查找user时不想查询密码可以传入{password:0}
 * 如果只希望看到某些字段{name:1}
 */
exports.findById = function (request, collectionName, id = "", notShow = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        var ObjectID = request.mongo.ObjectID;
        db.collection(collectionName).findOne({ "_id": new ObjectID(id) }, notShow, function (err, result) {
            if (err) {
                request.server.log(['error'], err);
                reject(err);
                throw err;
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * 查询某条数据(如果id不是ObjectID 返回{})
 * @param request 请求上下文
 * @param where 查询条件
 * @param isShow 不希望查询某些字段如查找user时不想查询密码可以传入{password:0}
 * 如果只希望看到某些字段{name:1}
 */
exports.findByIdOtherNull = function (request, collectionName, id = "", notShow = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        var ObjectID = request.mongo.ObjectID;
        if (!Tools.checkObjectIDOld(id)) {
            resolve(null);
        }
        db.collection(collectionName).findOne({ "_id": new ObjectID(id) }, notShow, function (err, result) {
            if (err) {
                request.server.log(['error'], err);
                reject(err);
                throw err;
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * 查询某条数据
 * @param request 请求上下文
 * @param where 查询条件
 * @param isShow 不希望查询某些字段如查找user时不想查询密码可以传入{password:0}
 * 如果只希望看到某些字段{name:1}
 */
exports.findOne = function (request, collectionName, where = {}, notShow = {}) {

    return new Promise(function (resolve, reject) {

        var db = request.mongo.db;
        db.collection(collectionName).findOne(where, notShow, function (err, result) {
            if (err) {
                request.server.log(['error'], err);
                throw err;
                resolve(err);
            } else {
                resolve(result)
            }
        });
    });
}

/**
 * 查询并更新某条数据
 * @param request 请求上下文
 * @param where 查询条件
 * @param update 更新文件
 * @param projection 不希望查询某些字段如查找user时不想查询密码可以传入{password:0}
 * 如果只希望看到某些字段{name:1}
 */
exports.findOneAndUpdate = function (request, collectionName, where = {}, update = {}, projection = {}) {

    return new Promise(function (resolve, reject) {

        var db = request.mongo.db;
        db.collection(collectionName).findOneAndUpdate(where, update, projection, function (err, result) {
            if (err) {
                request.server.log(['error'], err);
                throw err;
                resolve(err);
            } else {
                resolve(result)
            }
        });
    });
}

/**
 * 查询某个条数据
 * @param request 请求上下文
 * @param where 查询条件
 * @param notShow 不希望查询某些字段如查找user时不想查询密码可以传入{password:0}
 * @param sort 排序 {name:1} 1升序 -1 降序
 * @param limit 查询多少条
 * @param skip 从什么位置开始
 */
exports.find = (request, collectionName, where = {}, notShow = {}, sort = {}, page = 1, size = 10) => {
    return new Promise(function (resolve, reject) {
        const db = request.mongo.db;
        const sql = db.collection(collectionName).find(where, notShow).skip((page - 1) * size).limit(size).sort(sort);
        sql.toArray((err, result) => {
            if (err) {
                request.server.log(['error'], err);
                throw err;
                resolve(err);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * 查询所有列表
 * @param request 请求上下文
 * @param where 查询条件
 * @param notShow 不希望查询某些字段如查找user时不想查询密码可以传入{password:0}
 * @param skip 从什么位置开始
 */
exports.findAll = (request, collectionName, where = {}, notShow = {}, sort = {}) => {
    return new Promise(function (resolve, reject) {
        const db = request.mongo.db;
        const sql = db.collection(collectionName).find(where, notShow).sort(sort);
        sql.toArray((err, result) => {
            if (err) {
                request.server.log(['error'], err);
                throw err;
                resolve(err);
            } else {
                resolve(result);
            }
        });
    });
}


/**
 * 统计数据个数
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findCount = function (request, collectionName, where = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        var sql = db.collection(collectionName).find(where).count(
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result)
                }
            }
        );
    });
}

/**
 * 统计数据个数-同步
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findCountSync = function (request, collectionName, where = {}, callback) {
    var db = request.mongo.db;
    db.collection(collectionName).find(where).count(
        (err, result) => {
            if (err) {
                request.server.log(['error'], err);
                callback(err);
            } else {
                callback(null, result);
            }
        }
    );
}

/**
 * 统计数据个数
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findSum = function (request, collectionName, where = {}, pipeline = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        var sql = db.collection(collectionName).aggregate([where, pipeline], function (err, result) {
            if (err) {
                request.server.log(['error'], err);
                throw err;
                resolve(err);
            } else {
                resolve(result)
            }
        });
    });
}

/**
 * 更新一条数据
 * @param request 请求上下文
 * @param where  更新条件
 * @param reply 更新内容
 */
exports.updateOne = function (request, collectionName, where = "", reply = {}) {

    return new Promise(function (resolve, reject) {

        var db = request.mongo.db;
        if (where._id) {
            var ObjectID = request.mongo.ObjectID;
            where._id = new ObjectID(where._id);
        }

        db.collection(collectionName).updateOne(
            where, {
                $set: reply
            },
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

/**
 * 更新一条数据
 * @param request 请求上下文
 * @param where  更新条件
 * @param reply 更新内容
 */
exports.updateOne2 = function (request, collectionName, where = "", reply = {}) {

    return new Promise(function (resolve, reject) {

        var db = request.mongo.db;
        if (where._id) {
            var ObjectID = request.mongo.ObjectID;
            where._id = new ObjectID(where._id);
        }

        db.collection(collectionName).updateOne(
            where, reply,
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

/**
 * 更新多条数据
 * @param request 请求上下文
 * @param where  更新条件
 * @param reply 更新内容
 */
exports.update = function (request, collectionName, where, reply) {

    var db = request.mongo.db;
    return new Promise(function (resolve, reject) {
        db.collection(collectionName).update(
            where, {
                $set: reply
            },{multi:true},
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

/**
 * 添加一条数据
 * @param request 请求上下文
 * @param where  更新条件
 * @param reply 更新内容
 */
exports.save = function (request, collectionName, data) {
    var db = request.mongo.db;
    return new Promise(function (resolve, reject) {
        db.collection(collectionName).save(data, function (err) {
            if (err) {
                request.server.log(['error'], err);
                throw err;
                resolve(err);
            } else {
                resolve(data);
            }
        });
    });
}


/**
 * 删除数据
 * @param request 请求上下文
 * @param where  更新条件
 * @param reply 更新内容
 */
exports.del = function (request, collectionName, where) {
    var db = request.mongo.db;
    if (where._id) {
        var ObjectID = request.mongo.ObjectID;
        where._id = new ObjectID(where._id);
    }

    return new Promise(function (resolve, reject) {
        db.collection(collectionName).deleteOne(where, function (err, result) {
            if (err) {
                request.server.log(['error'], err);
                throw err;
                resolve(err);
            } else {
                resolve(result);
            }
        });
    });
}


/**
 * 根据学段和学科查询课本版本
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findEdition = function (request, collectionName, where = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        db.collection(collectionName).aggregate([{ $match: where }, { $group: { _id: { editionId: '$editionId', editionName: '$editionName' }, count: { '$sum': 1 } } }, { $project: { editionId: '$_id.editionId', editionName: '$_id.editionName', count: 1, _id: 0 } }, { $sort: { areaNum: -1 } }],
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result)
                }
            }
        );

    });
}

/**
 * 根据学段查询学科
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findSubject = function (request, collectionName, where = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        db.collection(collectionName).aggregate([{ $match: where }, { $group: { _id: { subjectId: '$subjectId', subjectName: '$subjectName' }, count: { '$sum': 1 } } }, { $project: { subjectId: '$_id.subjectId', subjectName: '$_id.subjectName', count: 1, _id: 0 } }, { $sort: { sortNum:1,subjectId: 1 } }],
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result)
                }
            }
        );
    });
}

//统计某字段的合计数
exports.groupTotal = function (request, collectionName, where = {}, gorupId, total = {}) {
    return new Promise((resolve, reject) => {
        var db = request.mongo.db;
        db.collection(collectionName).aggregate([{ $match: where }, { $group: { _id: gorupId, total: total } }], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}


/**
 * 分组查询权限
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findJurisdictionGroup = function (request, collectionName, where = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        db.collection(collectionName).aggregate([{ $match: where }, { $group: { _id: { groupName: '$groupName' }, count: { '$sum': 1 } } }, { $project: { groupName: '$_id.groupName', count: 1, _id: 0 } }, { $sort: { groupName: 1 } }],
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result)
                }
            }
        );

    });
}

/**
 * 积分排行榜
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findIntegralRank = function (request, collectionName, where = {}, page, size) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        db.collection(collectionName).aggregate([{ $match: where }, { $group: { _id: { userId: "$userId" }, total: { $sum: { $subtract: ["$amount_debit", "$amount_credit"] } }, num: { $sum: 1 } } }, { $project: { userId: '$_id.userId', total: 1, num: 1, _id: 0 } }, { $sort: { "total": -1 } }, { $skip: ((page - 1) * size) }, { $limit: size }],
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result)
                }
            }
        );
    });
}

/**
 * 组织机构关联父id查询
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findOrgAndParent = function (request, collectionName, where = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        db.collection(collectionName).aggregate([{ $match: where }, { $lookup: { from: collectionName, localField: "langchaoParentId", foreignField: "langchaoId", as: "parent" } }],
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result)
                }
            }
        );
    });
}

/**
 * 每天新增统计
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.statisticDays = function (request, collectionName, where = {}) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        db.collection(collectionName).aggregate([{ $match: where },
        { $project: { day: { $dateToString: { format: "%Y-%m-%d", date: { "$add": [new Date(0), "$createTime", 28800000] } } } } },
        { $group: { _id: "$day", number: { $sum: 1 } } }, { $sort: { _id: -1 } }],
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result)
                }
            }
        );
    });
}

/**
 * 组织机构关联父id查询（分页）
 * @param request 请求上下文
 * @param where 查询条件
 */
exports.findOrg = function (request, collectionName, where = {}, sort = {}, page, size) {
    return new Promise(function (resolve, reject) {
        var db = request.mongo.db;
        db.collection(collectionName).aggregate([{ $match: where }, { $lookup: { from: collectionName, localField: "langchaoParentId", foreignField: "langchaoId", as: "parent" } }, { $sort: sort }, { $skip: ((page - 1) * size) }, { $limit: size }],
            function (err, result) {
                if (err) {
                    request.server.log(['error'], err);
                    throw err;
                    resolve(err);
                } else {
                    resolve(result)
                }
            }
        );
    });
}


