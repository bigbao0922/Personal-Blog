const {db} = require('../Schema/config');   //获取db数据库
const TextSchema = require('../Schema/text');    //获取text数据库
const Text = db.model('texts', TextSchema);  //通过db对象创建comment数据库的模型对象

module.exports = Text;