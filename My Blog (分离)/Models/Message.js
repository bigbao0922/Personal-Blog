const {db} = require('../Schema/config');   //获取db数据库
const MessageSchema = require('../Schema/message');    //获取comment数据库
const Message = db.model('messages', MessageSchema);  //通过db对象创建comment数据库的模型对象

module.exports = Message;