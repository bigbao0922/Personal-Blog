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

  //渲染用户留言
  function renderMessage(data){
    let mes = $('.list-cont'),
        message = data.message,
        mesLen = message.length,
        maxNum = data.maxNum,
        str = '';
    $('.volume').html(`全部留言<p>${maxNum}</p>`);
    if(mesLen != 0){
      message.forEach((v, i) => {
        str += `<div class='cont'>
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
        });
      }else{
          $('#laypage')[0].style.display = 'none';
          str = `<p class='addMessage'>还没有小伙伴留言呢，快来说一句吧 !</p>`
      }
      mes.html(str)
  }



  //渲染用户登录状态
  getData("/api/user/state").then(data => renderUser(data));

  //渲染用户留言
  getData("/api/message").then(data => renderMessage(data));
  





  layui.use(['layedit', 'layer', 'element', "laypage"], function(){
    const $ = layui.$
    const layedit = layui.layedit;
    const layer = layui.layer;
    let element = layui.element;
    let laypage = layui.laypage;
  
  
    const idx = layedit.build('layui-textarea', {
      tool: [],
      height: 160
    }); //建立编辑器
  
    $(".layui-unselect.layui-layedit-tool").hide()
  
    
  
    $(".definite").click(async () => {
      let content = layedit.getContent(idx).trim()
  
      if(content.length === 0)return layer.msg("留言内容不能为空")
  
      const data = {
        content
      }
  
      $.post("/message/comment", data, (data) => {
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
  
    laypage.render({
      elem: "laypage",
      count: $("#laypage").data("maxnum"),
      limit: 5,
      groups: 5,
      curr: location.pathname.replace("/message/page", ""),
      jump(obj, f){
        $("#laypage a").each((i, v) => {
          let len = $("#laypage a").length;
          let pageValue = `/message/page${$(v).data("page")}`
          if($(v).data("page") === len){
            pageValue = `/message/page${len - 1}`;
          }else if($(v).data("page") === 0){
            pageValue = `/message`;
          };
          v.href = pageValue;
        })
      },
      theme : "#1E9FFF"
    })
  });
}