const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

//生成Schema实例
const CommentSchema = new Schema({
    //获取评论信息
    content: String,
    user: {
        type: ObjectId,
        ref: 'users'
    },
    article: {
        type: ObjectId,
        ref: 'articles'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created'
    }
});

//设置评论的remove后置钩子
CommentSchema.post('remove', (doc) => {
    const Article = require('../Models/article');
    const User = require('../Models/user');
    const {user, article} = doc;

    //文章与发出评论的用户的评论数分别减1
    Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec();
    User.updateOne({_id: user}, {$inc: {commentNum: -1}}).exec();
})

//导出CommentSchema对象
module.exports = CommentSchema;