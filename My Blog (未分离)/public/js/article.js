

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