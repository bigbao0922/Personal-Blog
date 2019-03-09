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