const Koa = require('koa');
const router = require('./routers/router');   //路由
const views = require('koa-views');     //视图
const static = require('koa-static');   //静态
const logger = require('koa-logger')    //日志(需第一个注册)
const body = require('koa-body')    //解析post数据
const session = require('koa-session')  //类似cookie的后端模块
const {join} = require('path');

//生成实例
const app = new Koa;

//签名钥匙
app.keys = ['my blog']

//session的配置对象
const CONFIG = {
    key: 'SID',         //session ID
    maxAge: 36e5,       //过期时间
    overwrite: true,    //是否覆盖（是）
    httpOnly: true,     //协议是否可见（否）
    signed: true,        //是否签名（是）
    rolling: true,      //是否刷新过期时间（是）
}

//注册各个模块的中间件
app
    .use(logger())  //注册日志模块
    .use(session(CONFIG, app))   //注册session
    .use(body())    //配置koa-body处理post请求数据
    .use(static(join(__dirname, 'public')))   //配置静态资源public为根目录
    .use(views(join(__dirname, 'views'), {
        extension: "pug"    //配置为pug模板
    })) //配置视图模块views为根目录

//注册路由信息
app
    .use(router.routes())
    .use(router.allowedMethods())


app.listen(3000, () => {
    console.log("项目启动成功，监听在3000端口")
})

//创建管理员用户，若存在则返回
{
    const {db} = require('./Schema/config');   //获取db数据库
    const UserSchema = require('./Schema/user');    //获取user数据库
    const encrypt = require('./util/encrypt')  //获取加密模块
    const User = db.model('users', UserSchema);  //通过db对象创建user数据库的模型对象
    //查找管理是否存在
    User
        .find({username: 'admin'})
        .then(data => {
            if(data.length === 0){
                //不存在，创建
                new User({
                    username: 'admin',
                    password: encrypt('admin'),
                    role: 666,
                    articleNum: 0,
                    commentNum: 0,
                    comment1Num: 0,
                    messageNum: 0,
                    photoNum: 0,
                })
                .save()
                .then(data => {
                    console.log('管理员用户名 => admin, 密码 => admin')
                }).catch(err => {
                    console.log('管理员账号创建失败')
                })
            }else{
                //存在，在控制台输出
                console.log('管理员用户名 => admin, 密码 => admin')
            }
        })
}