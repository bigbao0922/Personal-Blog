const {Schema} = require('./config');

//生成Schema实例
const UserSchema = new Schema({
    //获取用户信息
    username: String,
    password: String,
    articleNum: Number,
    commentNum: Number,
    comment1Num: Number,
    messageNum: Number,
    photoNum: Number,
    role: {
        type: String,
        default: 1
    },
    avatar: {
        type: String,
        default: '/avatar/img1.png'
    }
}, {versionKey: false});


//设置用户的remove后置钩子
UserSchema.post('remove', (doc) => {
    const Comment = require('../Models/comment');
    const Article = require('../Models/article');
    const Message = require('../Models/message');
    const Album = require('../Models/album');
    const { _id:userId} = doc;
    //减去该用户的所有日志,留言，照片
    Article.find({author: userId}).then(data => {
        data.forEach(v => v.remove())
    })
    Message.find({user: userId}).then(data => {
        data.forEach(v => v.remove())
    })
    Album.find({user: userId}).then(data => {
        data.forEach(v => v.remove())
    })
})

//导出UserSchema对象
module.exports = UserSchema;