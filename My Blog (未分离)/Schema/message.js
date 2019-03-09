const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

//生成Schema实例
const MessageSchema = new Schema({
    //获取评论信息
    content: String,
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

//设置评论的remove后置钩子
MessageSchema.post('remove', (doc) => {
    const User = require('../Models/user');
    const {user} = doc;

    //留言数减1
    User.updateOne({_id: user}, {$inc: {messageNum: -1}}).exec();
})

//导出CommentSchema对象
module.exports = MessageSchema;