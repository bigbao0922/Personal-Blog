/* 分页 */
layui.use(['layedit', 'layer', 'element', "laypage"], function(){
    const $ = layui.$;
    const layedit = layui.layedit;
    const layer = layui.layer;
    let element = layui.element;
    let laypage = layui.laypage;
    
    element.tabDelete('demo', 'xxx')

    const text = $(".Title").data("textTip");
  
    laypage.render({
      elem: "laypage",
      count: $("#laypage").data("maxnum"),
      limit: 5,
      groups: 5,
      curr: location.pathname.replace('/' + text +'/page', ""),
      jump(obj, f){
        $("#laypage a").each((i, v) => {
          let len = $("#laypage a").length;
          let pageValue = `/${$(".Title").data("textTip")}/page${$(v).data("page")}`
          if($(v).data("page") === len){
            pageValue = `/${$(".Title").data("textTip")}/page${len - 1}`;
          }else if($(v).data("page") === 0){
            pageValue = `/${$(".Title").data("textTip")}`;
          };
          v.href = pageValue;
        })
      },
      theme : "#1E9FFF"
    });
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
        text: $(".Title").data("textid")
      }
  
      $.post("/text/comment1", data, (data) => {
        console.log(layer.msg)
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
    const ID = window.location.pathname.split("/")[2];
    laypage.render({
      elem: "laypage",
      count: $("#laypage").data("maxnum"),
      limit: 5,
      groups: 5,
      curr: location.pathname.replace('/text/' + ID + '/page', ""),
      jump(obj, f){
        $("#laypage a").each((i, v) => {
          let len = $("#laypage a").length;
          let pageValue = `/text/${ID}/page${$(v).data("page")}`
          if($(v).data("page") === len){
            pageValue = `/text/${ID}/page${len - 1}`;
          }else if($(v).data("page") === 0){
            pageValue = `/text/${ID}/page1`;
          };
          v.href = pageValue;
        })
      },
      theme : "#1E9FFF"
    });
  });
  