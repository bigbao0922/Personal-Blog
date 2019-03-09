const Text = require('../Models/text')
const Comment1 = require('../Models/comment1')
const fs = require('fs');
const {join} = require('path');

//编辑文章
exports.addPage = async (ctx) => {
    await ctx.render('add-text', {
        title: '发表文章'
    })    
}

//文章发表
exports.add = async (ctx) => {
    //判断用户是否登录
    if(ctx.session.isNew){
        //未登录,无需查询数据库
        return ctx.body = {
            msg: '用户未登录',
            status: 0
        }
    }
    //用户登录
    const data = ctx.request.body;  //获取用户信息
    data.user = ctx.session.userId; //添加用户ID
    data.commentNum = 0;   //文章评论数初始化
    data.like = 0;
    data.readNum = 0;
    console.log(data)
    //将文章存储到texts数据库
    await new Promise((res, rej) => {        
        new Text(data).save((err, data) => {
            if(err) return rej(err);
            res(data);
        })
    })
    .then(data => {
        ctx.body = {
            msg: '发表成功',
            status: 1
        }
    })
    .catch(err => {
        ctx.body = {
            msg: '发表失败',
            status: 0
        }
    })
}

//获取文章列表并根据文章量进行分页
exports.getList = async (ctx) => {
    await ctx.render('index', {
        title: '博客主页'
    })
}

//文章详情
exports.details = async (ctx) => {
    //获取每篇日志路由的动态id
    const _id = ctx.params.id;
    //页面刷新一次阅读量加1
    Text
        .updateOne({_id}, {$inc: {readNum: 1}}, (err) => {
            if(err) return console.log(err);
            console.log('文章阅读量成功更新')
        })
    //获取当前评论数量
    const maxComment1 = await Comment1.find({text:_id}) 
    const maxNum = maxComment1.length
    await ctx.render('details', {
        title: '文章内容',
        maxNum
    })
}

//选取图片
exports.add = async (ctx) => {
    //判断用户是否登录
    if(ctx.session.isNew){
        //未登录,无需查询数据库
        return ctx.body = {
            msg: '用户未登录',
            status: 0
        }
    }
    //用户登录
    const data = ctx.request.body;  //获取用户信息
    data.user = ctx.session.userId; //添加用户ID
    //将照片存储到album数据库
    await new Promise((res, rej) => {        
        new Text(data).save((err, data) => {
            if(err) return rej(err);
            res(data);
        })
    })
    .then(data => {
        ctx.body = {
            msg: '上传成功',
            status: 1
        }
    })
    .catch(err => {
        ctx.body = {
            msg: '上传失败',
            status: 0
        }
    })
}

//上传
exports.upload = async ctx => {
    const filename = ctx.req.file.filename;
    await Text
        .updateOne({_id: null}, {$set: {photo: '/img/' + filename}}, (err) => {
            if(err){
                ctx.body = {
                    status: 0,
                    message: err
                }
            }else{
                ctx.body = {
                    status: 1,
                    message: '上传成功'
                }
            }
        })
        
  }

//文章分类
exports.tipList = async (ctx) => {
    const tips = ctx.params.tips;
    let flag = false;
    const arr = fs.readdirSync(join(__dirname,'../views'));
    arr.forEach(v => {
        const name = v.replace(/^(index\-)|(\.pug)$/g, "") 
        if(name === tips){
            flag = true;
        }
    })

    if(flag){
        await ctx.render("./index-" + tips, {
            title: '博客文章'
        })
    }else{        
        ctx.status = 404
        await ctx.render("404", {title: '404'})
    }
}

//所有文章
exports.textList = async (ctx) => {
    //获取用户id
    const userId = ctx.session.user._id;
    const data = await Text.find({user: userId})
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

//删除文章
exports.del = async (ctx) => {
    //获取日志id
    const textId = ctx.params.id;
    //删除日志
    let res = {
        state: 1,
        message: "删除成功"
      }
    
    await Text.findById(textId)
    .then(data => data.remove())
    .catch(err => {
        res = {
        state: 0,
        message: err
        }
    })
    ctx.body = res
}