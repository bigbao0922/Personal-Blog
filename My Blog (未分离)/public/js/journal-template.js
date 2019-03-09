/* 分页 */
layui.use(["element", "laypage","laydate"], () => {
    let element = layui.element
    let laypage = layui.laypage
    let laydate = layui.laydate
    const $ = layui.$
    
    element.tabDelete('demo', 'xxx')

    const article = $(".Title").data("arttip");
  
    laypage.render({
      elem: "laypage",
      count: $("#laypage").data("maxnum"),
      limit: 5,
      groups: 5,
      curr: location.pathname.replace('/journal/' + article +'/page', ""),
      jump(obj, f){
        $("#laypage a").each((i, v) => {
          let len = $("#laypage a").length;
          let pageValue = `/journal/${$(".Title").data("arttip")}/page${$(v).data("page")}`
          if($(v).data("page") === len){
            pageValue = `/journal/${$(".Title").data("arttip")}/page${len - 1}`;
          }else if($(v).data("page") === 0){
            pageValue = `/journal/${$(".Title").data("arttip")}`;
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
  