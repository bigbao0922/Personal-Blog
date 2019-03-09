const Text = require('../Models/text')
const Comment1 = require('../Models/comment1')
const User = require('../Models/user')

//添加,保存评论
exports.save = async (ctx) => {
    //返回未登录提示信息
    let message = {
        status: 0,
        msg: '请登录后进行评论发表'
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
    //将评论保存到comment1s数据库
    await new Comment1(data)
        .save()
        .then(data => {
            message = {
                status: 1,
                msg: '评论成功'
            }
            Text
                .updateOne({_id: data.text}, {$inc: {comment1Num: 1}}, (err) => {
                    if(err) return console.log(err);
                    console.log('文章评论数成功更新')
                })

            //更新用户的评论数
            User
                .updateOne({_id: data.user}, {$inc: {comment1Num: 1}}, (err) => {
                    if(err) return console.log(err);
                    console.log('文章评论数成功更新')
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

//查询用户所有评论
exports.comList = async (ctx) => {
    //获取用户id
    const userId = ctx.session.user._id;
    const data = await Comment1.find({user: userId}).populate('text', 'title');
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

//删除用户评论
exports.del = async (ctx) => {
    //获取评论id
    const comment1Id = ctx.params.id;

    //删除评论
    let res = {
        state: 1,
        message: "删除成功"
      }
    
      await Comment1.findById(comment1Id)
        .then(data => {
            data.remove();
        })
        .catch(err => {
          res = {
            state: 0,
            message: err
          }
        })
    
        ctx.body = res
}