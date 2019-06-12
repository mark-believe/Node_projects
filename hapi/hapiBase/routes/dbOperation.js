
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
      { name: '菜鸟工具'},
      { name: 'Google'},
      { name: 'Facebook'}
     ];
  dbo.collection("test").insertMany(myobj, function(err, res) {
      if (err) {
        reply("插入失败！");
        throw err;
      }
      console.log("插入的文档数量为: " + res.insertedCount);
      db.close();
      reply("插入成功！")
    });
});
}

module.exports = [
    {
      method: 'GET',
      path: '/db/u',
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
      path: '/db/c',
      handler: (request, reply)=>{
        insertToDB(reply);
      },
      config: {
        tags: ['api','DB'],
        description: '添加数据'
      }
    }
  ]