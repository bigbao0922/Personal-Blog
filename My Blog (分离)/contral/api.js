const User = require('../Models/user')
const Text = require('../Models/text')
const Message = require('../Models/message')
const Comment1 = require('../Models/comment1')
const Comment = require('../Models/comment')
const Article = require('../Models/article')
const Album = require('../Models/album')




//用户状态判断
exports.userState = async ctx => {
    let data = {};
    let userId = ctx.cookies.get("userId")
    if(userId){
      const user = await User.findById(userId)
          .then(data => data)
      const role = user.role,
            avatar = user.avatar;
            data = ctx.session = {
                username: ctx.cookies.get('username'),
                user,
                avatar,
                role
            }
    }else{
        data = ctx.session = {}
    }
    ctx.body = data;
}

//留言数与日志数
exports.userNum = async (ctx) => {
    const articleNum = await Article.estimatedDocumentCount((err, num) =>{
        err ? console.log(err) : num;
    });
    const messageNum = await Message.estimatedDocumentCount((err, num) =>{
        err ? console.log(err) : num;
    });
    ctx.body = data = {
        articleNum,
        messageNum
    }
};

//文章列表
exports.textList = async (ctx) => {
    const textList = await Text.find().sort('-created')
          .then(data => data)
    data = ctx.body = {
        textList
    }
};

//文章列表分类
exports.textTip = async (ctx) => {
    //操作日志实例
    const tipList1 = await Text
        .find({tips: 'first'}) //查找该类型的日志集合
        .sort('-created') //排序
        .then(data => data)
    const tipList2 = await Text
        .find({tips: 'second'}) //查找该类型的日志集合
        .sort('-created') //排序
        .then(data => data)
    const tipList3 = await Text
        .find({tips: 'thirdly'}) //查找该类型的日志集合
        .sort('-created') //排序
        .then(data => data)
    data = ctx.body = {
        tipList1,
        tipList2,
        tipList3
    }
}

//文章详情
exports.TextDetails = async (ctx) => {
    //获取每篇日志路由的动态id
    const _id = ctx.request.header.referer.split("/")[4].replace(/\?/g,"");
    //查找文章数据
    const text = await Text
        .findById(_id)
        .populate({
            path: 'user',
            select: 'username avatar'
        })
        .then(data => data)
    //获取评论页码动态id
    let page = ctx.request.header.referer.split("/")[5] ? ctx.request.header.referer.split("/")[5].slice(4).replace(/\?/g,"") : false || 1;
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

    data = ctx.body = {
        comment1,
        maxNum,
        text,
        next,
        prev
    }
}

//日志列表分类
exports.getArtlist = async (ctx) => {
    //获取每篇日志作者对应的头像，显示于日志前面
    //获取动态id
    let page = (ctx.request.header.referer.split("/")[4] ? ctx.request.header.referer.split("/")[4].slice(4) : false) || 1;
    page--;
    let page1 = (ctx.request.header.referer.split("/")[5] ? ctx.request.header.referer.split("/")[5].slice(4) : false) || 1;
    page1--;
    // console.log(page2)
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

    const artList1 = await Article
        .find({tips: 'html'}) //查找所有日志集合
        .sort('-created') //排序
        .skip(5 * page1) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    const artList2 = await Article
        .find({tips: 'css'}) //查找所有日志集合
        .sort('-created') //排序
        .skip(5 * page1) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    const artList3 = await Article
        .find({tips: 'javascript'}) //查找所有日志集合
        .sort('-created') //排序
        .skip(5 * page1) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    const artList4 = await Article
        .find({tips: 'nodejs'}) //查找所有日志集合
        .sort('-created') //排序
        .skip(5 * page1) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    const artList5 = await Article
        .find({tips: 'vue'}) //查找所有日志集合
        .sort('-created') //排序
        .skip(5 * page1) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    const artList6 = await Article
        .find({tips: 'react'}) //查找所有日志集合
        .sort('-created') //排序
        .skip(5 * page1) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))
    const artList7 = await Article
        .find({tips: 'angular'}) //查找所有日志集合
        .sort('-created') //排序
        .skip(5 * page1) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'author',
            select: 'username _id avatar'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    data = ctx.body = {
        artList,
        artList1,
        artList2,
        artList3,
        artList4,
        artList5,
        artList6,
        artList7,
        hotArt,
        maxNum
    }
}

//日志详情
exports.artDetails = async (ctx) => {
    //获取每篇日志路由的动态id
    const _id = ctx.request.header.referer.split("/")[5];
    //查找日志数据
    const article = await Article
        .findById(_id)
        .populate({
            path: 'author',
            select: 'username avatar'
        })
        .then(data => data)
    //获取评论页码动态id
    let page = ctx.request.header.referer.split("/")[6] ? ctx.request.header.referer.split("/")[6].slice(4) : false || 1;
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

    data = ctx.body = {
        comment,
        maxNum,
        article,
        hotArt,
        next,
        prev
    }
}

//用户留言
exports.getMeslist = async (ctx) => {
    //获取每篇日志作者对应的头像，显示于日志前面
    //获取动态id
    let page = ctx.request.header.referer.split("/")[4] ? ctx.request.header.referer.split("/")[4].slice(4).replace(/\?/g,"") : false || 1;
    page--;
    //获取留言数量
    const maxNum = await Message.estimatedDocumentCount((err, num) =>{
        err ? console.log(err) : num;
    })
    //操作留言实例
    const message = await Message
        .find() //查找所有留言集合
        .sort('-created') //排序
        .skip(5 * page) //跳过
        .limit(5)   //筛选，获取5条数据
        .populate({
            path: 'user',
            select: 'username avatar _id'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))
    data = ctx.body ={
        message,
        maxNum
    }
}

//相册
exports.albumList = async (ctx) => {
    //获取每篇日志作者对应的头像，显示于日志前面
    //获取动态id
    let page = ctx.request.header.referer.split("/")[4] ? ctx.request.header.referer.split("/")[4].slice(4) : false || 1;
    page--;
    //获取留言数量
    const maxNum = await Album.estimatedDocumentCount((err, num) =>{
        err ? console.log(err) : num;
    })
    //操作留言实例
    const album = await Album
        .find() //查找所有留言集合
        .sort('-created') //排序
        .skip(16 * page) //跳过
        .limit(16)   //筛选，获取5条数据
        .populate({
            path: 'user',
            select: 'username avatar _id'
        }) //mongoose用于连表查询
        .then(data => data)
        .catch(err => console.log(err))
    data = ctx.body = {
        album,
        maxNum
    }
}