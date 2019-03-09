const multer = require('koa-multer');
const {join} = require('path')

//配置头像存储对象
const storage = multer.diskStorage({
    //头像存储的位置
    destination: join(__dirname,'../public/avatar'),
    //头像文件名
    filename(req, file, cb){
        const filename = file.originalname.split('.');
        cb(null, `${Date.now()}.${filename[filename.length - 1]}`)
    }
})

module.exports = multer({storage})