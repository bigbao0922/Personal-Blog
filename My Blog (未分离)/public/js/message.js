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