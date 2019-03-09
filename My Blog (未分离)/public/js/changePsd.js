layui.use(['element', "layer"], function(){
    const layer = layui.layer
    const $ = layui.$
    
    let $newPassword = $(".layui-show input[name=newPassword]")
    let $confirmPWD = $(".layui-show input[name=confirmPWD]")
    
  
    $confirmPWD.on("blur", function(){
      const pwd = $newPassword.val()
      if($(this).val() !== pwd){
        layer.msg("请输入正确的新密码")
        $(this).val("")
      }
    });
    layer.msg(val);
  });