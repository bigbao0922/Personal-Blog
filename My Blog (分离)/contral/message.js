const Message = require('../Models/message')
const User = require('../Models/user')



exports.getList = async (ctx) => {
    //获取每篇日志作者对应的头像，显示于日志前面
    //获取留言数量
    const maxNum = await Message.estimatedDocumentCount((err, num) =>{
        err ? console.log(err) : num;
    })
    await ctx.render('message', {
        title: '博客留言',
        maxNum
    })
}

//将留言存储到数据库
exports.save = async (ctx) => {
    //返回未登录提示信息
    let message = {
        status: 0,
        msg: '请登录后进行留言'
    }

    //验证用户是否登录
    if(ctx.session.isNew){
        //未登录,无需查询数据库
        return ctx.body = message;
    }

    //用户已登录
    const data = ctx.request.body;
    //添加用户ID
    data.user = ctx.session.user._id;
    //将评论保存到messages数据库
    await new Message(data)
        .save()
        .then(data => {
            message = {
                status: 1,
                msg: '留言成功'
            }
            //更新用户的留言数
            User
                .updateOne({_id: data.user}, {$inc: {messageNum: 1}}, (err) => {
                    if(err) return console.log(err);
                    console.log('留言数成功更新')
                })
            
        })
        .catch(err => {
            message = {
                status: 0,
                msg: err
            }
        })
    ctx.body = message
}

//所有留言
exports.mesList = async (ctx) => {
    //获取用户id
    const userId = ctx.session.user._id;
    const data = await Message.find({user: userId});
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

//删除留言
exports.del = async (ctx) => {
    //获取留言id
    const messageId = ctx.params.id;
    //删除日志
    let res = {
        state: 1,
        message: "删除成功"
      }
    
    await Message.findById(messageId)
    .then(data => data.remove())
    .catch(err => {
        res = {
        state: 0,
        message: err
        }
    })
    ctx.body = res
}