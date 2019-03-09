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