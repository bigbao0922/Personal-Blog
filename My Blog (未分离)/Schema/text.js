const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

//生成Schema实例
const TextSchema = new Schema({
    //获取评论信息
    tips: String,
    title: String,
    content: String,
    comment1Num: Number,
    like: Number,
    readNum: Number,
    users_like_this_article: Array,
    photo:String,
    user: {
        type: ObjectId,
        ref: 'users'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created'
    }
});

//设置文章的remove后置钩子
TextSchema.post('remove', (doc) => {
    const Comment = require('../Models/comment');
    const User = require('../Models/user');
    const { _id:textId, user: userId } = doc;
    //对应日志的用户的日志数减1
    User.findByIdAndUpdate(userId, {$inc: {textNum: -1}}).exec();

    //减去该日志的所有评论数
    Comment.find({text: textId}).then(data => {
        data.forEach(v => v.remove())
        
    })
})

//导出CommentSchema对象
module.exports = TextSchema;