const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

//生成Schema实例
const ArticleSchema = new Schema({
    //获取日志信息
    tips: String,
    title: String,
    content: String,
    commentNum: Number,
    like: Number,
    readNum: Number,
    users_like_this_article: Array,
    author: {
        type: ObjectId,
        ref: 'users'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created'
    }
});

//设置日志的remove后置钩子
ArticleSchema.post('remove', (doc) => {
    const Comment = require('../Models/comment');
    const User = require('../Models/user');
    const { _id:artId, author: authorId } = doc;
    //对应日志的用户的日志数减1
    User.findByIdAndUpdate(authorId, {$inc: {articleNum: -1}}).exec();

    //减去该日志的所有评论数
    Comment.find({article: artId}).then(data => {
        data.forEach(v => v.remove())
    })
})

//导出ArticleSchema对象
module.exports = ArticleSchema;