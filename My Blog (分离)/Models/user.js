const {db} = require('../Schema/config');   //获取db数据库
//获取用户的Schema，用来操作users集合的实例对象
const UserSchema = require('../Schema/user');    //获取user数据库
const User = db.model('users', UserSchema);  //通过db对象创建user数据库的模型对象

module.exports = User;