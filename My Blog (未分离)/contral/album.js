const Album = require('../Models/album')
const User = require('../Models/user')

//文件上传网页渲染
exports.addPhoto = async (ctx) => {
    await ctx.render('add-photo', {
        title: '照片上传',
        session: ctx.session
    })
    
}

//照片选取
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
    data.photoNum = 0;   //照片数初始化
    //将照片存储到album数据库
    await new Promise((res, rej) => {        
        new Album(data).save((err, data) => {
            if(err) return rej(err);
            //更新用户照片计数
            User.
                updateOne({_id: data.user}, {$inc:{photoNum: 1}}, err => {
                    if(err)return console.log(err)
                    console.log('照片计数更新成功')
                })
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

//照片列表
exports.getList = async (ctx) => {
    //获取每篇日志作者对应的头像，显示于日志前面
    //获取动态id
    let page = ctx.params.id || 1;
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
    await ctx.render('album', {
        session: ctx.session,
        title: '博客相册',
        album,
        maxNum
    })
}


//照片上传
exports.upload = async ctx => {
    const filename = ctx.req.file.filename;
    await Album
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

//所有照片
exports.albList = async (ctx) => {
    //获取用户id
    const userId = ctx.session.userId;
    const data = await Album.find({user: userId});
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

//删除照片
exports.del = async (ctx) => {
    //获取留言id
    const albId = ctx.params.id;
    //删除日志
    let res = {
        state: 1,
        message: "删除成功"
      }
    
    await Album.findById(albId)
    .then(data => data.remove())
    .catch(err => {
        res = {
        state: 0,
        message: err
        }
    })
    ctx.body = res
}