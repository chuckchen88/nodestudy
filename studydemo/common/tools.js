
var moment = require('moment')    //格式化时间
moment.locale('zh-cn')

/**
 * 格式化时间
 * @param date
 * @param friendly
 * @returns {*}
 */
exports.formatDate = function(date, friendly){
    date = moment(date)
    if(friendly){
        return date.fromNow()
    }else{
        return date.format('YYYY-MM-DD HH:mm')
    }
}

/**
 * 验证邮箱
 * @param mail 邮箱
 * @returns {boolean}
 */
exports.isMail = function (mail) {
    return (/^(w-*.*)+@(w-?)+(.w{2,})+$/).test(mail)
}
/**
 * 统一返回数据
 * @param code [num]  状态码
 * @param message [string] 提示信息
 * @param data [array] 数据
 * @returns {*}
 */
exports.responseData = function(code,message,data){
    return {code:code,msg:message,data:data};
}
