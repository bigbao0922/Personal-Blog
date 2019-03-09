layui.use('element', function(){
    var element = layui.element;
    const $ = layui.$

    $(".layui-clear li a").each((i, v) => {
      const a_href = $(v).prop('href')
      const len = $(".layui-clear li a").length;
      if(a_href === location.href){        
        $('.layui-clear li').eq(i).addClass("layui-this")
      }
    })
  });