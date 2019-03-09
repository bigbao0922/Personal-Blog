const {db} = require('../Schema/config');   //获取db数据库
const Comment1Schema = require('../Schema/comment1');    //获取comment数据库
const Comment1 = db.model('comment1s', Comment1Schema);  //通过db对象创建comment数据库的模型对象

module.exports = Comment1;