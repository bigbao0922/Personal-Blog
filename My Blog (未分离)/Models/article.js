const {db} = require('../Schema/config');   //获取db数据库
//获取日志的Schema，用来操作articles集合的实例对象
const ArticleSchema = require('../Schema/article');    //获取article数据库
const Article = db.model('articles', ArticleSchema);  //通过db对象创建Article数据库的模型对象

module.exports = Article;