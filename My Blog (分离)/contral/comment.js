const Article = require('../Models/article')
const Comment = require('../Models/comment')
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
    //将评论保存到comments数据库
    await new Comment(data)
        .save()
        .then(data => {
            message = {
                status: 1,
                msg: '评论成功'
            }
            //评论计数
            Article
                .updateOne({_id: data.article}, {$inc: {commentNum: 1}}, (err) => {
                    if(err) return console.log(err);
                    console.log('日志评论数成功更新')
                })

            // Article
            //     .updateOne({_id: data.article}, {$addToSet: {users_like_this_article: data.user}}, (err) => {
            //         if(err) return console.log(err);
            //         console.log('评论数成功更新')
            //     })

            //更新用户的评论数
            User
                .updateOne({_id: data.user}, {$inc: {commentNum: 1}}, (err) => {
                    if(err) return console.log(err);
                    console.log('评论数成功更新')
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
    const data = await Comment.find({user: userId}).populate('article', 'title');
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

//删除用户评论
exports.del = async (ctx) => {
    //获取评论id
    const commentId = ctx.params.id;

    //删除评论
    let res = {
        state: 1,
        message: "删除成功"
      }
    
      await Comment.findById(commentId)
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