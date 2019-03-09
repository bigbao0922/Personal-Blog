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

  //渲染日志列表
  function renderArticle(data){
    let article = $(".article-list"),
        hotArticle = $(".hotList"),
        str = "",
        hot = "",
        artList = data.artList,
        hotArt = data.hotArt,
        hotlen = hotArt.length,
        maxNum = data.maxNum;
        if(maxNum > 0){
          artList.forEach((v, i) => {
              str += `<li>
                    <a class='list-face'>
                      <img src=${v.author.avatar} alt=${v.author}>
                    </a>
                    <h2>
                      <a class='layui-badge'>${v.tips}</a>
                      <a class='articlt-title ellipsis' href='/journal/article/${v._id}'>${v.title}</a>
                    </h2>
                    <div class='list-info'>
                      <a>${v.author.username}</a>
                      <p class='UpdateTime'>更新时间</p>
                      <span>${new Date(v.updatedAt).toLocaleString()}</span>
                      <p class='CreatedTime'>发布时间</p>
                      <span>${new Date(v.created).toLocaleString()}</span>
                      <span class='list-reply'>
                        <i title="赞" class='layui-icon layui-icon-praise'>${v.like}</i>
                        <i title="评论" class='layui-icon layui-icon-reply-fill'>${v.commentNum}</i>
                        <i title="阅读量" class='layui-icon layui-icon-read'>${v.readNum}</i>
                      </sapn>
                    </div>
                </li>`
            });
        }else{
          $('#laypage')[0].style.display = 'none';
          str = `<p class='addlog'>还没有小伙伴发布日志呢，赶紧<a class="layui-btn layui-bg-blue" href="/journal/article">发布一篇</a>吧 !</p>`
        }
        if(hotlen !=0){
          hotArt.forEach((v, i) => {
            hot += `<p>
              <a href='/journal/article/${v._id}'>【${v.tips}模块】 ${v.title}</a>
              <span class='list-reply'>
                <i title="赞" class='layui-icon layui-icon-praise'>${v.like}</i>
                <i title="评论" class='layui-icon layui-icon-reply-fill'>${v.commentNum}</i>
                <i title="阅读量" class='layui-icon layui-icon-read'>${v.readNum}</i>
              </span>
            </p>`
          })
        }else{
          hot =`<p class='hotArticle'>还没有热门推荐，看看其他的吧 o(*￣︶￣*)o</p>`
        }
    article.html(str);
    hotArticle.html(hot);
  }



  //渲染用户登录状态
  getData("/api/user/state").then(data => renderUser(data));

  //渲染日志列表
  getData("/api/article").then(data => renderArticle(data));





   /* 分页 */
   layui.use(["element", "laypage", "laydate"], () => {
    let element = layui.element
    let laypage = layui.laypage
    let laydate = layui.laydate
    const $ = layui.$
    
    element.tabDelete('demo', 'xxx')

    laypage.render({
      elem: "laypage",
      count: $("#laypage").data("maxnum"),
      limit: 5,
      groups: 5,
      curr: location.pathname.replace("/journal/page", ""),
      jump(obj, f){
        $("#laypage a").each((i, v) => {
          let len = $("#laypage a").length;
          let pageValue = `/journal/page${$(v).data("page")}`
          if($(v).data("page") === len){
            pageValue = `/journal/page${len - 1}`;
          }else if($(v).data("page") === 0){
            pageValue = `/journal`;
          };
          v.href = pageValue;
        })
      },
      theme : "#1E9FFF"
    });
    //日期
    laydate.render({
      elem: '#test2'
      ,position: 'static'
      ,calendar: true //是否开启公历重要节日
      ,done: function(value, date, endDate){
        if(date.year == 2017 && date.month == 11 && date.date == 30){
          dateIns.hint('一不小心就月底了呢');
        }
      }
      ,change: function(value, date, endDate){
        layer.msg(value)
      }  
    });
  })
}



















