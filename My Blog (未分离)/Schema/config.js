//连接数据库并导出db Schema
const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost:27017/project',{
    useNewUrlParser: true
});

//获取mongoose的Schema规范数据字段做检测
const Schema = mongoose.Schema;

//用原生ES6的promise代替mongoose自实现的promise
mongoose.Promise = global.Promise;

//监听数据库的连接状态
db.on('error', () => {
    console.log('数据库连接失败')
});

db.on('open', () => {
    console.log('project数据库连接成功')
});

//导出db Schema
module.exports = {
    db,
    Schema
};