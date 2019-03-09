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

  //渲染用户相册
  function renderAlbum(data){
    let alb = $('.layui-row'),
        str = ``,
        album = data.album,
        maxNum = data.maxNum;
      if(maxNum  != 0){
        album.forEach((v, i) => {
          str += `<div class='layui-col-xs12 layui-col-sm4 layui-col-md4'>
            <div class='item'>
              <img src='${v.photo}'>
              <div class='cont-text'>
                <div class='img'>
                  <img src='${v.user.avatar}'>
                  <p>${v.user.username}</p>
                  <p>上传于：</p>
                  <div class='data'>${new Date(v.created).toLocaleDateString()}</div>
                </div>
                <p calss='address'>
                  <i class='layui-icon layui-icon-location'></i>
                  <span>${v.site}</span>
                </p>
                <p calss='briefly'>${v.content}</p>
              </div>
            </div>
          </div>`
          });
        }else{
          $('#laypage')[0].style.display = 'none';
          $('.layui-btn')[0].style.display = 'none';
          str = `<p class='addalbum'>还没有小伙伴展示自己呢，赶紧<a class="layui-btn layui-bg-blue" href="/album/upload"">展示一下</a>吧 !</p>`
        }
      alb.html(str)
  }



  //渲染用户登录状态
  getData("/api/user/state").then(data => renderUser(data));

  //渲染用户留言
  getData("/api/album").then(data => renderAlbum(data));
  




  /* 分页 */
  layui.use(["element", "laypage"], () => {
    let element = layui.element
    let laypage = layui.laypage
    const $ = layui.$
    
    element.tabDelete('demo', 'xxx')

    laypage.render({
      elem: "laypage",
      count: $("#laypage").data("maxnum"),
      limit: 16,
      groups: 16,
      curr: location.pathname.replace("/album/page", ""),
      jump(obj, f){
        $("#laypage a").each((i, v) => {
          let len = $("#laypage a").length;
          let pageValue = `/album/page${$(v).data("page")}`
          if($(v).data("page") === len){
            pageValue = `/album/page${len - 1}`;
          }else if($(v).data("page") === 0){
            pageValue = `/album`;
          };
          v.href = pageValue;
        })
      },
      theme : "#1E9FFF"
    });
  })
}
















