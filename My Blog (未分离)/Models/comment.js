const {db} = require('../Schema/config');   //获取db数据库
const CommentSchema = require('../Schema/comment');    //获取comment数据库
const Comment = db.model('comments', CommentSchema);  //通过db对象创建comment数据库的模型对象

module.exports = Comment;