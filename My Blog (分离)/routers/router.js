const Router = require('koa-router');   //路由模块获取
const user = require('../contral/user'); //获取操作用户表的逻辑对象
const article = require('../contral/article'); //获取操作日志的逻辑对象
const comment = require('../contral/comment'); //获取操作日志评论的逻辑对象
const admin = require('../contral/admin'); //获取操作用户后台的逻辑对象
const message = require('../contral/message'); //获取操作用户后台的逻辑对象
const text = require('../contral/text');
const album = require('../contral/album');
const comment1 = require('../contral/comment1');
const api = require('../contral/api');
const upload = require('../util/upload'); //获取配置操作模块
const uploadPhoto = require('../util/uploadPhoto');
const router = new Router;  //实例路由模块





/*****文章添加----文章详情----文章评论*****/
//主页
router.get('/', user.keepLog, text.getList);

//添加文章
router.get('/text', user.keepLog, text.addPage);

//发表文章
router.post('/text', user.keepLog, text.add);

//文章图片上传
router.post('/upload/uploadPhoto', user.keepLog, uploadPhoto.single('file'), text.upload);

//文章分类
router.get('/index/:tips', user.keepLog, text.tipList);

//文章详情页
router.get('/text/:id', user.keepLog, text.details);

//文章详情页评论分页路由
router.get('/text/:id/page:comId', user.keepLog, text.details);

//文章评论发表
router.post('/text/comment1', user.keepLog, comment1.save);





/*****用户注册----用户登录----密码修改*****/
//注册与登陆
router.get(/^\/user\/(reg|login)/, async (ctx) => {
    //得到布尔值，true为注册，false为登陆
    const show = /(reg)$/.test(ctx.path);
    await ctx.render('register', {
        title: show ? '用户注册' : '用户登录',
        show
    });
});

//处理用户登陆的post请求
router.post('/user/login', user.login);

//处理用户注册的post请求与路由
router.post('/user/reg', user.reg);

//退出
router.get('/user/logout', user.logout);

//修改密码
router.get('/user/changePsd', user.keepLog, async (ctx) => {
    await ctx.render('changePsd', {
        title: '修改密碼',
        session: ctx.session
    });
});

//密码重置
router.post('/user/changePsd', user.changePsd);





/*****日志发表----日志分类----列表分页*****/

//日志
router.get('/journal', user.keepLog, article.getList);

//添加日志
router.get('/journal/article', user.keepLog, article.addPage);

//发表日志
router.post('/journal/article', user.keepLog, article.add);

//日志列表分页路由
router.get('/journal/page:id', article.getList);

//日志分类
router.get('/journal/:tips', user.keepLog, article.tipList);

//日志分类列表分页路由
router.get('/journal/:tips/page:id', article.tipList);

//日志详情页
router.get('/journal/article/:id', user.keepLog, article.details);

//日志详情页评论分页路由
router.get('/journal/article/:id/page:comId', user.keepLog, article.details);

//日志评论发表
router.post('/journal/article/comment', user.keepLog, comment.save);

//日志点赞
router.post('/journal/article/like', user.keepLog, article.like);





/*****照片上传----照片分页*****/

//相册
router.get('/album', user.keepLog, album.getList);

//添加照片
router.get('/album/upload', user.keepLog, album.addPhoto);

//照片发布
router.post('/album/upload', user.keepLog, album.add);

//照片上传
router.post('/upload/photo', user.keepLog, uploadPhoto.single('file'), album.upload);

//相册列表分页路由
router.get('/album/page:id', album.getList);





/*****留言发表----留言分页*****/

//留言
router.get('/message', user.keepLog, message.getList);

//留言发表
router.post('/message/comment', user.keepLog, message.save);

//留言分页路由
router.get('/message/page:id', message.getList);





/*****博主自我介绍*****/

//关于
router.get('/about', user.keepLog, async (ctx) => {
    await ctx.render('about', {
        title: '关于博客作者',
        session: ctx.session
    });
});





/*****后台管理----用户/日志/评论/留言/照片/头像*****/

//后台管理
router.get('/admin/:id', user.keepLog, admin.index);

//头像上传
router.post('/upload', user.keepLog, upload.single('file'), user.upload);

//获取所有日志评论
router.get('/user/comments', user.keepLog, comment.comList);

//删除用户日志评论
router.del('/comment/:id', user.keepLog, comment.del);

//获取所有文章评论
router.get('/user/comment1s', user.keepLog, comment1.comList);

//删除用户文章评论
router.del('/comment1/:id', user.keepLog, comment1.del);

//获取所有日志
router.get('/user/articles', user.keepLog, article.artList);

//删除日志
router.del('/article/:id', user.keepLog, article.del);

//获取所有文章
router.get('/user/texts', user.keepLog, text.textList);

//删除照片
router.del('/text/:id', user.keepLog, text.del);

//获取所有留言
router.get('/user/messages', user.keepLog, message.mesList);

//删除留言
router.del('/message/:id', user.keepLog, message.del);

//获取所有照片
router.get('/user/albums', user.keepLog, album.albList);

//删除照片
router.del('/albums/:id', user.keepLog, album.del);

//获取所有用户
router.get('/user/users', user.keepLog, user.userList);

//删除用户
router.del('/user/:id', user.keepLog, user.del);










/**************************************************************接口**************************************************************/

/******主页******/
//用户登录状态接口
router.get("/api/user/state", api.userState);

//留言数/日志数接口
router.get("/api/user/num", api.userNum);

//文章列表接口
router.get("/api/text", api.textList);

//文章分类列表接口
router.get("/api/index/:tips", api.textTip);

//文章详情接口
router.get("/api/text/details", api.TextDetails);





/******日志******/
//日志列表接口
router.get("/api/article", api.getArtlist);

//日志详情接口
router.get("/api/article/details", api.artDetails);





/******留言******/
//留言接口
router.get("/api/message", api.getMeslist);





/******相册******/
//相册接口
router.get("/api/album", api.albumList);





/*****访问页面不存在，进行报错处理*****/

//404报错
router.get('*', async ctx => {
    await ctx.render('404', {
        title: 404
    })
})






//导出实例对象
module.exports = router;