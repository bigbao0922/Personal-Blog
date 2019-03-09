const Article = require('../Models/article')
const Comment = require('../Models/comment')
const User = require('../Models/user')
const fs = require('fs');
const {join} = require('path');
//编辑日志
exports.addPage = async (ctx) => {
    await ctx.render('add-article', {
        title: '发表日志',
        session: ctx.session
    })
    
}

//编辑完的日志发布成功保存至数据库
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
    data.author = ctx.session.userId; //添加用户ID
    data.commentNum = 0;   //日志评论数初始化
    data.like = 0;
    data.readNum = 0;
    //将日志存储到articles数据库
    await new Promise((res, rej) => {        
        new Article(data).save((err, data) => {
            if(err) return rej(err);
            //更新用户日志计数
            User.
                updateOne({_id: data.author}, {$inc:{articleNum: 1}}, err => {
                    if(err)return console.log(err)
                    console.log('日志计数更新成功')
                })
            res(data);
        })
    })
    .then(data => {
        ctx.body = {
            msg: '发布成功',
            status: 1
        }
    })
    .catch(err => {
        ctx.body = {
            msg: '发布失败',
            status: 0
        }
    })
}

//获取日志列表并根据日志量进行分页
exports.getList = async (ctx) => {
    //获取每篇日志作者对应的头像，显示于日志前面
    //获取动态id
    let page = ctx.params.id || 1;
    page--;
    //获取日志数量
    const maxNum = await Article.estimatedDocumentCount((err, num) =>{
        err ? console.log(err) : num;
    })
    //操作日志实例
    const artList = await Article
        .find() //查找所有日志集合
        .sort('-created') //排序
        .skip(5 * page) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    const hotArt = await Article
        .find({readNum:{$gt: 100}}) //查找所有日志集合
        .sort('-readNum') //排序
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    await ctx.render('journal', {
        session: ctx.session,
        title: '博客日志',
        artList,
        maxNum,
        hotArt
    })
}

//每篇日志详情
exports.details = async (ctx) => {
    //获取每篇日志路由的动态id
    const _id = ctx.params.id;
    //页面刷新一次阅读量加1
    Article
        .updateOne({_id}, {$inc: {readNum: 1}}, (err) => {
            if(err) return console.log(err);
            console.log('阅读量成功更新')
        })
    //查找日志数据
    const article = await Article
        .findById(_id)
        .populate({
            path: 'author',
            select: 'username avatar'
        })
        .then(data => data)
    //获取评论页码动态id
    let page = ctx.params.comId || 1;
    page--;
    //获取当前评论数量
    const maxComment = await Comment.find({article:_id}) 
    const maxNum = maxComment.length
    const time = article.created;
    //获取当前文章之后创建的文章
    const next = await Article
        .find({created:{$gt: time}})
        .sort('-created')

    const prev = await Article
        .find({created:{$lt: time}})
        .sort('-created')

    //操作评论实例
    const comment = await Comment
        .find({article:_id}) //查找该日志的所有评论集合
        .sort('-created') //排序
        .skip(5 * page) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'user',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))
        

    const hotArt = await Article
        .find({readNum:{$gt: 100}}) //查找阅读量大于100的日志集合
        .sort('-readNum') //排序
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    await ctx.render('article', {
        title:'日志内容',
        session: ctx.session,
        comment,
        maxNum,
        article,
        hotArt,
        next,
        prev
    })
}

//日志点赞
exports.like = async (ctx) => {
    //返回未登录提示信息
    let message = {
        status: 0,
        msg: '请登录后进行点赞'
    }

    //验证用户是否登录
    if(ctx.session.isNew){
        //未登录,无需查询数据库
        return ctx.body = message;
    }

    //用户已登录
    const data = ctx.request.body;
    //添加用户ID
    data.user = ctx.session.userId;


    Article
        .updateOne({_id: data.article}, {$addToSet: {users_like_this_article: data.user}}, (err) => {
            if(err) return console.log(err);
            console.log('日志点赞用户+1')
        })

    // Article
    //     .updateOne({_id: data.article}, {$pull: {users_like_this_article: data.user}}, (err) => {
    //         if(err) return console.log(err);
    //         console.log('日志点赞用户-1')
    //     })
    const arr = await Article
        .find({_id: data.article})
    const count = arr[0].users_like_this_article.length;
    Article
        .updateOne({_id: data.article}, {$set: {like: count}},  (err) => {
            if(err) return console.log(err);
            console.log('点赞数已更新')
        })
}

//所有日志
exports.artList = async (ctx) => {
    //获取用户id
    const userId = ctx.session.userId;
    const data = await Article.find({author: userId})
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

//日志分类与分页
exports.tipList = async (ctx) => {
    let page = ctx.params.id || 1;
    page--;
    const tips = ctx.params.tips;
    //该类型的日志数量
    const tipsNum = await Article.find({tips: tips});
    const maxNum = tipsNum.length;
    //操作日志实例
    const artList = await Article
        .find({tips: tips}) //查找该类型的日志集合
        .sort('-created') //排序
        .skip(5 * page) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))
    let flag = false;
    const arr = fs.readdirSync(join(__dirname,'../views'));
    arr.forEach(v => {
        const name = v.replace(/^(journal\-)|(\.pug)$/g, "")
        if(name === tips){
            flag = true;
        }
    })

    const hotArt = await Article
        .find({readNum:{$gt: 100}}) //查找阅读量大于100的日志集合
        .sort('-readNum') //排序
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    if(flag){
        await ctx.render("./journal-" + tips, {
            session: ctx.session,
            title: '博客日志',
            artList,
            maxNum,
            hotArt
        })
    }else{        
        ctx.status = 404
        await ctx.render("404", {title: '404'})
    }
}

//删除日志
exports.del = async (ctx) => {
    //获取日志id
    const articleId = ctx.params.id;
    //删除日志
    let res = {
        state: 1,
        message: "删除成功"
      }
    
    await Article.findById(articleId)
    .then(data => data.remove())
    .catch(err => {
        res = {
        state: 0,
        message: err
        }
    })
    ctx.body = res
}