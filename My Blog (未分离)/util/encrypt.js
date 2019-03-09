//加密模块
const crypto = require('crypto');

//导出加密对象(返回加密成功的数据)
module.exports = function(password, key = 'bigbao is huangjingyu'){
    //password: 用户密码，key: 服务器生成的密钥
    //创建加密方式
    const hmac = crypto.createHmac('sha256', key);
    //加密密码
    hmac.update(password)
    //获取加密后密码
    const passwordHmac = hmac.digest('hex');
    return passwordHmac;
}