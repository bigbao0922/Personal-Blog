const Text = require('../Models/text')
const Article = require('../Models/article')
const Comment1 = require('../Models/comment1')
const Message = require('../Models/message')
const fs = require('fs');
const {join} = require('path');


//编辑文章
exports.addPage = async (ctx) => {
    await ctx.render('add-text', {
        title: '发表文章',
        session: ctx.session
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
    //获取每篇日志作者对应的头像，显示于日志前面
    //获取动态id
    let page = ctx.params.id || 1;
    page--;
    const number = await Article.estimatedDocumentCount((err, num) =>{
        err ? console.log(err) : num;
    })
    const messageNum = await Message.estimatedDocumentCount((err, num) =>{
        err ? console.log(err) : num;
    })
    //操作日志实例
    const textList = await Text
        .find() //查找所有日志集合
        .sort('-created') //排序
        .populate({
            path: 'user',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    await ctx.render('index', {
        session: ctx.session,
        title: '博客主页',
        textList,
        number,
        messageNum
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
    //查找文章数据
    const text = await Text
        .findById(_id)
        .populate({
            path: 'user',
            select: 'username avatar'
        })
        .then(data => data)
    //获取评论页码动态id
    let page = ctx.params.comId || 1;
    page--;
    //获取当前评论数量
    const maxComment1 = await Comment1.find({text:_id}) 
    const maxNum = maxComment1.length
    const time = text.created;
    //获取当前文章之后创建的文章
    const next = await Text
        .find({created:{$gt: time}})
        .sort('-created')

    const prev = await Text
        .find({created:{$lt: time}})
        .sort('-created')

    //操作评论实例
    const comment1 = await Comment1
        .find({text:_id}) //查找该文章的所有评论集合
        .sort('-created') //排序
        .skip(5 * page) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'user',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    await ctx.render('details', {
        session: ctx.session,
        title: '了解一下',
        comment1,
        maxNum,
        text,
        next,
        prev
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
    //操作日志实例
    const textList = await Text
        .find({tips: tips}) //查找该类型的日志集合
        .sort('-created') //排序
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))
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
            session: ctx.session,
            title: '博客文章',
            textList
        })
    }else{        
        ctx.status = 404
        await ctx.render("404", {title: '404'})
    }
}

//所有文章
exports.textList = async (ctx) => {
    //获取用户id
    const userId = ctx.session.userId;
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