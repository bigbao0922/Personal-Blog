(function(){
    function randomHexColor() { //随机生成十六进制颜色
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
    }
    // 鼠标左击特效
    document.onclick = function(e){
        e = e || window.event;
        var color = randomHexColor(),
            oLeft = document.createElement('div'),
            oRight = document.createElement('div'),
            oH = document.createElement('div'),
            sDiv = document.createDocumentFragment();
        sDiv.appendChild(oLeft);      
        sDiv.appendChild(oRight);   
        oH.appendChild(sDiv);   
        document.body.appendChild(oH);
        oLeft.className = 'left';
        oLeft.style.backgroundColor = color;
        oRight.className = 'right';
        oRight.style.backgroundColor = color; 
        oH.className = 'heart';
        oH.style.left = e.clientX - 10 +"px";
        oH.style.top = e.clientY - 10 +"px";
        animate(oH,e.clientY-40);
        var num = 100;
        function animate(ele,target) {
            clearInterval(ele.timer);
            ele.timer = setInterval(function () {
                var step = (target-ele.offsetTop)/10;
                step = step>0?Math.ceil(step):Math.floor(step);
                num -= 3;
                ele.style.top = ele.offsetTop + step + "px";
                ele.style.opacity = (num/100).toFixed(1);
                if(Math.abs(target-ele.offsetTop)<Math.abs(step)){
                    ele.style.top = target + "px";
                    ele.style.opacity = 0.1;
                    clearInterval(ele.timer);
                    document.body.removeChild(oH);
                }
            },25);
        }
    }
    // 自定义鼠标右键
    document.oncontextmenu = function (e){
        e = e || window.event;
        if(e.button === 2){
            e.preventDefault();
            var oText = document.createElement('span');
            oText.className = "heart";
            oText.innerHTML = "偷窥一时爽，一直偷窥一直爽！";
            oText.style.color = randomHexColor();
            document.body.appendChild(oText);
            oText.style.left = e.clientX + "px";
            oText.style.top = e.clientY + "px";
            animate(oText,0.3);
            var num = 100;
            function animate(ele,target) {
                clearInterval(ele.timer);
                ele.timer = setInterval(function () {
                    num -= 2;
                    ele.style.opacity = (num/100).toFixed(1);
                    if((num/100 - target) <= 0){
                        ele.style.opacity = target;
                        clearInterval(ele.timer);
                        document.body.removeChild(oText);
                    }
                },25);
            }
        }
    }
})()