const {db} = require('../Schema/config');   //获取db数据库
const AlbumSchema = require('../Schema/album');    //获取comment数据库
const Album = db.model('albums', AlbumSchema);  //通过db对象创建comment数据库的模型对象

module.exports = Album;