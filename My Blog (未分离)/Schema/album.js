const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;

//生成Schema实例
const AlbumSchema = new Schema({
    //获取评论信息
    content: String,
    site: String,
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

//设置相册的remove后置钩子
AlbumSchema.post('remove', (doc) => {
    const User = require('../Models/user');
    const {user} = doc;

    //照片数减1
    User.updateOne({_id: user}, {$inc: {photoNum: -1}}).exec();
})

//导出CommentSchema对象
module.exports = AlbumSchema;