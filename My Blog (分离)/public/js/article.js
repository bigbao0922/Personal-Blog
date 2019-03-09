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
  function renderArticle(data){
    let art = $('.item-box'),
        hotArticle = $(".hotList"),
        str = ``,
        com = ``,
        hot = "",
        prevText = '',
        nextText = '',
        laypage = ``,
        article = data.article,
        comment = data.comment,
        maxNum = data.maxNum,
        hotArt = data.hotArt,
        comLen = comment.length,
        hotlen = hotArt.length,
        next = data.next,
        prev = data.prev,
        prevLen = prev.length,
        nextLen = next.length;
    if(prevLen != 0){
        prevText = `上一篇：<a class='prev' href=/journal/article/${prev[0]._id}>${prev[0].title}</a>`
    }else{
        prevText = `上一篇：<span>前面已经没有啦！</sapn>`
    }
    $('.top').html(prevText)
    if(nextLen != 0){
        nextText = `下一篇：<a class='next' href=/journal/article/${next[0]._id}>${next[0].title}</a>`
    }else{
        nextText = `下一篇：<span>这已经是最后一篇啦!</span>`
    }
    $('.down').html(nextText)
    if(comLen != 0){
      comment.forEach((v, i) => {
        laypage = `<div id='laypage' data-maxNum=${maxNum}></div>`
        com += `<div class='cont'>
          <div class='img'>
            <img src=${v.user.avatar}>
          </div>
          <div class='text'>
            <p class='tit'>
              <span class='name'>${v.user.username}</span>
              <span class='data'>${new Date(v.created).toLocaleString()}</span>
              <p class='ct'>${v.content}</p>
            </p>
          </div>
        </div>`      
      })
    }else{
      com = `<p class='addComment'>还没有小伙伴发表自己的想法，赶紧写下你的想法吧 !</p>`
    }
    str = `<h1 class='Title' data-artid=${article._id}>${article.title}</h1>
      <div class='item'>
        <div class='whisper-title'>
          <i class='layui-icon layui-icon-date'></i>
          <span>发表于：</span>
          <span class='data'>${new Date(article.created).toLocaleString()}</span>
          <span>类别：</sapn>
          <sapn calss='tips'>${article.tips}</span>
        </div>
        <p class='text-cont'>${article.content}</p>
        <div class='op-list'>
          <p class='like'>
            <i class='layui-icon layui-icon-praise'></i>
            <span>${article.like}</span>
          </p>
          <p class='edit'>
            <i class='layui-icon layui-icon-reply-fill'></i>
            <span>${article.commentNum}</span>
          </p>
          <p class='read'>
            <i class='layui-icon layui-icon-read'></i>
            <span>${article.readNum}</span>
          </p>
          <p class='off' off='true'>
            <span>收起</span>
            <i class='layui-icon layui-icon-up'></i>
          </p>
        </div>
      </div>
      <div class='review-version'>
        <div class='form'>
          <img src=${article.author.avatar}>
          <form class='layui-form' action="">
            <div class='layui-form-item layui-form-text'>
              <div class='layui-input-block'>
                <textarea calss='layui-textarea' id='layui-textarea' name="desc"></textarea>
              </div>
            </div>
            <div class='layui-form-item'>
              <div class='layui-input-block' style="text-align: right;">
                <button class='layui-btn definite'>确定</button>
              </div>
            </div>
          </form>
        </div>
        <div class='list-cont'>${com}</div>
      </div>${laypage}`;
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
    art.html(str);
    hotArticle.html(hot);
  }

  //渲染用户登录状态
  getData("/api/user/state").then(data => renderUser(data));

  //渲染文章详情内容
  getData("/api/article/details").then(data => renderArticle(data));  




  layui.config({
    base: '/js/util/'
  }).use(['element','laypage','form','menu'],function(){
    element = layui.element,laypage = layui.laypage,form = layui.form,menu = layui.menu;
    menu.init();
    menu.off();
    menu.submit()
  });
  

  layui.use(['layedit', 'layer', 'element', "laypage", "laydate"], function(){
    const $ = layui.$
    const layedit = layui.layedit;
    const layer = layui.layer
    let element = layui.element
    let laypage = layui.laypage
    let laydate = layui.laydate
  
    const idx = layedit.build('layui-textarea', {
      tool: [],
      height: 160
    }); //建立编辑器
  
    $(".layui-unselect.layui-layedit-tool").hide()
    
    //评论
    $(".definite").click(async () => {
      let content = layedit.getContent(idx).trim()
  
      if(content.length === 0)return layer.msg("评论内容不能为空")
  
      const data = {
        content,
        article: $(".Title").data("artid")
      }
  
      $.post("/journal/article/comment", data, (data) => {
        layer.msg(data.msg, {
          time: 1000,
          end(){
            if(data.status === 1){
              window.location.reload()
            }
          }
        })
      })
    });
  
  
    //点赞
    const data = {
        article: $(".Title").data("artid")
      }
    $(".op-list .like .layui-icon-praise").click(async () => {
      $.post("/journal/article/like", data, (data) => {
        layer.msg(data.msg, {
          time: 1000,
          end(){
            if(data.status === 1){
              window.location.reload()
            }
          }
        })
      })
    });
  
  
    element.tabDelete('demo', 'xxx')
    //对应日志的id
    const article = $(".Title").data("artid");
    laypage.render({
      elem: "laypage",
      count: $("#laypage").data("maxnum"),
      limit: 5,
      groups: 5,
      curr: location.pathname.replace('/journal/article/' + article + '/page', ""),
      jump(obj, f){
        $("#laypage a").each((i, v) => {
          let len = $("#laypage a").length;
          let pageValue = `/journal/article/${$(".Title").data("artid")}/page${$(v).data("page")}`
          if($(v).data("page") === len){
            pageValue = `/journal/article/${$(".Title").data("artid")}/page${len - 1}`;
          }else if($(v).data("page") === 0){
            pageValue = `/journal/article/${$(".Title").data("artid")}/page1`;
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
      ,mark: { //标记重要日子
        '0-10-14': '生日'
        ,'2018-08-28': '新版'
        ,'2018-10-08': '神秘'
      } 
      ,done: function(value, date, endDate){
        if(date.year == 2017 && date.month == 11 && date.date == 30){
          dateIns.hint('一不小心就月底了呢');
        }
      }
      ,change: function(value, date, endDate){
        layer.msg(value)
      }  
    });
  
  });


}