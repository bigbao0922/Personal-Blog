window.onload = () => {
    let $ = layui.$;
  
    //请求的封装
    function getData(url, method, data) {
        return new Promise((res, rej) => {
            $.ajax({
                type: method || "GET",
                url: url,
                dataType: "json",
                data: data,
                success: data => {res(data)}
            });
        });
    }    

    //渲染用户登录状态
    function renderUser(data) {
        let userList = $(".welcome-text"),
            str = "";
            addArt = $('.title .addText');
    
        //添加文章权限
        if(`${data.role}` > 1){
            addArt.html(`<a href="/text" class='layui-btn layui-bg-blue'>添加文章</a>`)
        }else{
            addArt.html(`<p class='expand'>了解一下</p>`)
        }
        //用户登录状态
        if(!!data.username){
            str = `<li class='layui-nav-item'>
                    <a href=${data.role > 1 ? "/admin/user": "/admin/article"}>个人中心</a>
                </li>
                <li class='layui-nav-item'>
                    <a href="">
                        <img src=${data.avatar} class='layui-nav-img'>
                        <sapn>${data.username}</span>
                    </a>
                    <dl class='layui-nav-down'>
                        <dd>
                            <a href="/user/changePsd">密码修改</a>
                        </dd>
                        <dd>
                            <a href="/user/logout">退出登录</a>
                        </dd>
                    </dl>
                </li>`;        
        }else{
            str = `<li class='layui-nav-item'>
                    <a href="/user/login">登录</a>
                </li>
                <li class='layui-nav-item'>
                    <a href="/user/reg">注册</a>
                </li>`;
        }
        userList.html(str);
    }

    //渲染留言数/日志数
    function rendernum(data){
        let count = $('.access');
        //留言数
        count[0].innerHTML = `${data.messageNum ? data.messageNum : 0}`;
        //日志数
        count[1].innerHTML = `${data.articleNum ? data.articleNum : 0}`
    }
    

    //渲染首页文章列表
    function renderText(data){
        let listItem = $('.cont .list-item'),
            str = '',
            textList = data.textList,
            len = textList.length;
        if(len != 0){
            textList.forEach((v, i) => {
                if(v.tips === 'first'){
                    v.tips = '前端开发'
                }else if(v.tips === 'second'){
                    v.tips = '后端开发'
                }else{
                    v.tips = '开发工具'
                }
                str += `<div class='item'>
                    <div class='layui-fluid'>
                        <div class='layui-row'>
                            <div class='layui-col-xs12 layui-col-sm4 layui-col-md5'>
                                <div class='img'>
                                    <img src='${v.photo}'>
                                </div>
                            </div>
                            <div class='layui-col-xs12 layui-col-sm8 layui-col-md7'>
                                <div class='item-cont'>
                                    <h3>${v.title}
                                        <button class='layui-btn layui-btn-danger new-icon'>new</button>                                    
                                    </h3>
                                    <h5>${v.tips}</h5>
                                    <div class='briefly'>${v.content}</div>
                                    <a class='go-icon'href='/text/${v._id}'></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> `; 
              });
        }else{
            str =`<p class='addlog'>管理员还没有发布文章呢，去看看小伙伴么的<a class="layui-btn layui-bg-blue" href="/journal">日志</a>吧 !</p>`
        }
        listItem.html(str);
    }


    //渲染用户登录状态
    getData("/api/user/state").then(data => renderUser(data));

    //渲染留言数/日志数
    getData("/api/user/num").then(data => rendernum(data));

    //渲染文章列表
    getData("/api/text").then(data => renderText(data));
}