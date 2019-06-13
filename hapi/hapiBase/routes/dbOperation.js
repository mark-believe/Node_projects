
const config = require('../config');
const db = require('mongodb');

function findFromDB(reply)
{
  db.MongoClient.connect(config.db, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    dbo.collection("test"). find({}).toArray(function(err, result) { // 返回集合中所有数据
        if (err) 
        {
          throw err;
        }
        db.close();
        console.log("文档查询成功");
        reply(result);
    });
  });

}

function insertToDB(reply)
{
  db.MongoClient.connect(config.db, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    var myobj =  [
      { 
        id: 1,
        name: 'Silicate soup',
        cuisine: 'Martian',
        stars: 100,
        serves: 1,
        prep_time: '2 hours',
        cooking_time: '12 minutes'
      },
      { 
        id: 2,
        name: 'Methane trifle',
        cuisine: 'Neptunian',
        stars: 200,
        serves: 1,
        prep_time: '1 hours',
        cooking_time: '24 minutes'
      },
      { 
        id: 3,
        name: 'Mark trifle',
        cuisine: 'Neptunian',
        stars: 300,
        serves: 1,
        prep_time: '5 hours',
        cooking_time: '18 minutes'
      }
     ];
  dbo.collection("test").insertMany(myobj, function(err, res) {
      if (err) {
        reply("插入失败！");
        throw err;
      }
      console.log("插入的文档数量为: " + res.insertedCount);
      //db.close();
      reply("插入成功！")
    });
  });
}

function updateToDB(reply)
{
  db.MongoClient.connect(config.db, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    //var whereStr = {"name":'菜鸟工具'};  // 查询条件
    var whereStr = {"name":{$regex:/菜鸟工具/}};
    var updateStr = {$set: { "name" : "菜鸟工具-已修改" + Date.now() }};
    dbo.collection("test").updateMany(whereStr, updateStr, function(err, res) {
        if (err) throw err;
        console.log("文档更新成功");
        //db.close();
        reply("更新成功")
    });
  });
}

function deleteFromDB(reply)
{
  db.MongoClient.connect(config.db, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    //var whereStr = {"name":'菜鸟工具'};  // 查询条件
    var whereStr = {"name":{$regex:/菜鸟工具/}};
    dbo.collection("test").deleteMany(whereStr, function(err, res) {
        if (err) throw err;
        console.log("文档删除成功");
        //db.close();
        reply("删除成功")
    });
  });
}

module.exports = [
    {
      method: 'GET',
      path: '/db/c',
      handler: (request, reply)=>{
        insertToDB(reply);
      },
      config: {
        tags: ['api','DB'],
        description: '添加数据'
      }
    },
    {
      method: 'GET',
      path: '/db/u',
      handler: (request, reply)=>{
        updateToDB(reply);
      },
      config: {
        tags: ['api','DB'],
        description: '更新数据'
      }
    },
    {
      method: 'GET',
      path: '/db/r',
      handler: (request, reply)=>{
        findFromDB(reply);
      },
      config: {
        tags: ['api','DB'],
        description: '查询数据'
      }
    },
    {
      method: 'GET',
      path: '/db/d',
      handler: (request, reply)=>{
        deleteFromDB(reply);
      },
      config: {
        tags: ['api','DB'],
        description: '删除数据'
      }
    }
  ]