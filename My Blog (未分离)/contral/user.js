const User = require('../Models/user')
const encrypt = require('../util/encrypt')  //获取加密模块

//用户注册
exports.reg = async (ctx) => {
    //获取post发送过来的用户注册信息
    const userinfo = ctx.request.body;
    //用户名
    const username = userinfo.username;
    //密码
    const password = userinfo.password;
    //头像
    const avatar = userinfo.avatar;
    //在User数据库中查找post所发送过来的username是否存在于数据库
    await new Promise((res, rej) => {
        User.find({username}, (err, data) => {
            //查询报错，传递失败状态和错误对象
            if(err) return rej(err);
            //注册的用户名包含中文
            const reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(reg.test(username)) return rej("用户名不可以含有中文");
            //数据库查询未出错，找到同名的数据
            if(data.length !== 0) return res("")
            //数据库查询未出错，没有找到同名的数据,进行注册并存储到数据库(密码保存之前需加密)
            const newUser = new User({
                username,
                password: encrypt(password), //密码加密
                avatar,
                commentNum: 0,
                articleNum: 0,
                messageNum: 0,
                textNum:0,
                photoNum: 0
            });
            //存储新数据至数据库
            newUser.save((err, data) => {
                if(err){
                    rej(err);
                }else{
                    res(data);
                };
            });
        });
    })
    .then(async data => {
        if(data){
            //用户名不存在并且不含有中文，注册成功
            await ctx.render('isOk',{
                status: '注册成功！'
            });
        }else{
            //用户名存在为老用户
            await ctx.render('isOk',{
                status: '用户名已存在，请前往登录！'
            });
        };
    })
    .catch(async err => {
        if (err === "用户名不可以含有中文") {
            //用户名包含中文
            await ctx.render("isOk", {
                status: "用户名不可以含有中文，注册失败！"
            });
        } else {
            //其他错误
            await ctx.render("isOk", {
                status: "未知错误，注册失败！"
            });
        }
    });
};

//用户登录
exports.login = async (ctx) => {
    //获取post发送过来的用户注册信息
    const userinfo = ctx.request.body;
    //用户名
    const username = userinfo.username;
    //密码
    const password = userinfo.password;
    //在User数据库中查找post所发送过来的username是否存在于数据库
    await new Promise((res, rej) => {
        User.find({username}, (err, data) => {
            //查询报错，传递失败状态和错误对象
            if(err) return rej(err);
            //数据库查询未出错，没有找到同名的数据
            if(data.length === 0) return rej("用户名不存在")
            //数据库查询未出错，找到同名的数据，将密码进行加密与数据库做对比
            if (data[0].password === encrypt(password)) {
                return res(data);   //查询到数据，且密码正确
            } else {
                return res(""); //查询到数据，但是密码不对
            };
        });
    })
    .then(async data => {
        if(!data){
            //密码错误，提示登录失败
            await ctx.render('isOk', {
                status: '密码错误，登录失败！'
            });
        }else{
            //设置用户名的cookie值，方便下次数据请求的读取
            ctx.cookies.set('username', username, {
                //配置当前用户的cookie的属性
                domain: "localhost",    //挂载的主机名
                path: "/",  //路径
                maxAge: 36e5,   //过期时间
                httpOnly: true, //不让客户端访问这条cookie
                overwrite: false,    //不可覆盖
            });

            //设置用户ID的cookie值，方便下次数据请求的读取
            ctx.cookies.set('userId', data[0]._id, {
                //配置当前用户的id值属性
                domain: "localhost",    //挂载的主机名
                path: "/",  //路径
                maxAge: 36e5,   //过期时间
                httpOnly: true, //不让客户端访问这条cookie
                overwrite: false,    //不可覆盖
            });

            //设置用户头像的cookie值，方便下次数据请求的读取
            ctx.cookies.set('useravatar', data[0].avatar, {
                //配置当前用户的id值属性
                domain: "localhost",    //挂载的主机名
                path: "/",  //路径
                maxAge: 36e5,   //过期时间
                httpOnly: true, //不让客户端访问这条cookie
                overwrite: false,    //不可覆盖
            })

            //设置用户头像的role值，方便下次数据请求的读取
            ctx.cookies.set('role', data[0].role, {
                //配置当前用户的id值属性
                domain: "localhost",    //挂载的主机名
                path: "/",  //路径
                maxAge: 36e5,   //过期时间
                httpOnly: true, //不让客户端访问这条cookie
                overwrite: false,    //不可覆盖
            })

            //设置后台的session内的字段
            ctx.session = {
                username,
                userId: data[0]._id,
                avatar : data[0].avatar, //取到用户头像
                role: data[0].role
            };
            //密码正确，登录成功
            await ctx.render('isOk', {
                status: '登录成功!'
            });
        };
    })
    .catch(async err => {
        if (err === "用户名不存在") {
            //用户名不存在
            await ctx.render("isOk", {
                status: "用户不存在，登录失败！"
            });
        } else {
            //其他错误
            await ctx.render("isOk", {
                status: "未知错误，登录失败！"
            });
        }
    })
}

//用户登录状态
exports.keepLog = async (ctx, next) => {
    //判断session是否存在
    if (ctx.session.isNew) {
        //从未登录过
        if (ctx.cookies.get("userId")) {
            //cookie有，session 没有
            //更新一下session
            let userId = ctx.cookies.get("userId")
            const avatar = await User.findById(userId)
                .then(data => data.avatar)
            ctx.session = {
                username: ctx.cookies.get("username"),
                userId,
                avatar,
                role,
            };
        }
    }
    await next();
}

//用户退出
exports.logout = async (ctx) => {
    //清空session数据
    ctx.session = null;
    //清空cookie数据
    ctx.cookies.set("username", null, {
        maxAge: 0
    });
    ctx.cookies.set("userId", null, {
        maxAge: 0
    });
    ctx.cookies.set("useravatar", null, {
        maxAge: 0
    });
    ctx.cookies.set("role", null, {
        maxAge: 0
    });
    // 重定向 到根路由 ---首页
    ctx.redirect("/");
};

//用户修改密码
exports.changePsd = async (ctx) => {
    if(ctx.session.isNew){
        ctx.status = 404
        return await ctx.render('404', {title: '404'})
    }
    //获取当前登录用户的id
    const userId = ctx.session.userId;
    //拿到post发来的原密码
    const oldPassword = ctx.request.body.oldPassword;
    const newPassword = ctx.request.body.newPassword;
    //判断与前一次设置的密码是否相同
    await new Promise((res, rej) => {
        User.find({_id: userId}, (err, data) => {
            //查询报错，传递失败状态和错误对象
            if(err) return rej(err);
            //数据库查询未出错，将原密码进行加密与数据库做对比
            if (data[0].password === encrypt(oldPassword)) {
                return res(data);   //查询到数据，且密码匹配
            } else {
                return res(""); //查询到数据，但是密码不对
            };
        });
    })
    .then(async data => {
        if(!data){
            //与原密码匹配不一致
            await ctx.render("changePsd", {
                status: "原密码输入错误,修改失败!"
            });
        }else if(data[0].password === encrypt(newPassword)){
            await ctx.render("changePsd", {
                status: "新密码不可与原密码一致,修改失败!"
            });
        }else{
            await User.findByIdAndUpdate({_id: userId}, {$set: {password: encrypt(newPassword)}})
            //清空session数据
            ctx.session = null;
            //清空cookie数据
            ctx.cookies.set("username", null, {
                maxAge: 0
            });
            ctx.cookies.set("userId", null, {
                maxAge: 0
            });
            ctx.cookies.set("useravatar", null, {
                maxAge: 0
            });
            ctx.cookies.set("role", null, {
                maxAge: 0
            });
            await ctx.render("isOk", {
                status: "密码修改成功,请重新登录!"
            });
        }
    })
};

//头像上传
exports.upload = async (ctx) => {
    //获取文件名
    const filename = ctx.req.file.filename;
    await User
        .updateOne({_id: ctx.session.userId}, {$set: {avatar: '/avatar/' + filename}}, (err) => {
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

//所有用户
exports.userList = async (ctx) => {
    //获取所有用户 
    const data = await User.find()
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

//删除用户
exports.del = async (ctx) => {
    //获取用户id
    const userid = ctx.params.id;
    //删除用户
    let res = {
        state: 1,
        message: "删除成功"
      }
    
    await User.findById(userid)
    .then(data => data.remove())
    .catch(err => {
        res = {
            state: 0,
            message: err
        }
    })
    ctx.body = res
}