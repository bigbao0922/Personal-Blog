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


    //渲染用户登录状态
    getData("/api/user/state").then(data => renderUser(data));

    //渲染留言数/日志数
    getData("/api/user/num").then(data => rendernum(data));
}