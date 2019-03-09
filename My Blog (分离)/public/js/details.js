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
    function renderUser(data){
        let userList = $(".welcome-text"),
            str = "";
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

    //渲染文章详情内容
    function renderText(data){
        let listItem = $('.article-cont'),
            comment = $('.list-cont'),
            str = '',
            com = '',
            prevText = '',
            nextText = '',
            Text = data.text,
            MaxNum = data.maxNum,
            Comment1 = data.comment1,
            comLen = Comment1.length,
            Next = data.next,
            Prev = data.prev,
            prevLen = Prev.length,
            nextLen = Next.length;
            $('.volume').html(`全部评论<span>${MaxNum}</span>`)
            if(prevLen != 0){
                prevText = `<a href=/text/${Prev[0]._id}>上一篇</a>`
            }else{
                prevText = `<a>已是第一篇</a>`
            }

            if(nextLen != 0){
                nextText = `<a href=/text/${Next[0]._id}>下一篇</a>`
            }else{
                nextText = `<a>已是最后一篇</a>`
            }
            str = `<div class='title'>
                <h3 class='Title' data-textid=${Text._id}>${Text.title}</h3>
                <p class='cont-info'>
                    <span class='data'>${new Date(Text.created).toLocaleString()}</span>
                    <span class='read'>
                        <i class='layui-icon layui-icon-read'></i>
                        <span>${Text.readNum}</span>
                    </span>
                </p>
            </div>
            <img src=${Text.photo}>
            <div>${Text.content}</div>
            <div class='btn-box'>
                <button class='layui-btn layui-btn-primary'>${prevText}</button>
                <button class='layui-btn layui-btn-primary'>${nextText}</button>
            </div>`; 
            listItem.html(str);
            if(comLen != 0){
                Comment1.forEach((v, i) => {
                    com += `<div class='cont comment'>
                        <div class='img'>
                            <img src=${v.user.avatar}>
                        </div>
                        <div class='text'>
                            <p class='tit'>
                                <span class='name'>${v.user.username}</span>
                                <sapn class='data'>${new Date(v.created).toLocaleString()}</span>
                            </p>
                            <p class='ct'>${v.content}</p>
                        </div>
                    </div>`
                })
            }else{
                $('#laypage')[0].style.display = 'none';
                com = `<p class='addComment'>还没有小伙伴发表自己的想法，赶紧写下你的想法吧 !</p>`
            }
            comment.html(com)
    }

    //渲染用户登录状态
    getData("/api/user/state").then(data => renderUser(data));

    //渲染文章详情内容
    getData("/api/text/details").then(data => renderText(data));


}