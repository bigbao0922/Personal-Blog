const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

//生成Schema实例
const Comment1Schema = new Schema({
    //获取评论信息
    content: String,
    user: {
        type: ObjectId,
        ref: 'users'
    },
    text: {
        type: ObjectId,
        ref: 'texts'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created'
    }
});

//设置评论的remove后置钩子
Comment1Schema.post('remove', (doc) => {
    const Text = require('../Models/text');
    const User = require('../Models/user');
    const {user, text} = doc;
    console.log(user)
    //文章与发出评论的用户的评论数分别减1
    Text.updateOne({_id: text}, {$inc: {comment1Num: -1}}).exec();
    User.updateOne({_id: user}, {$inc: {comment1Num: -1}}).exec();
})

//导出CommentSchema对象
module.exports = Comment1Schema;