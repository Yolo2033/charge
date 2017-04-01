var app = getApp()
var utilMd5 = require('../../utils/md5.js')
function orderData(amount) {
    var openId = wx.getStorageSync('openId')
    var data = {
        appid: app.globalData.appId,
        body: "test",
        mch_id: app.globalData.mch_id,
        nonce_str: createNonceStr(),
        notify_url: 'https://wx.eeyycc.cn/api/v1/user/ttt',
        openid: openId,
        out_trade_no: createOut_trade_no(),
        spbill_create_ip: '0.0.0.0',
        total_fee: 1,
        trade_type: 'JSAPI'
    }
    data.sign = createSign(data)
    return data
}
function payData(prepay_id) {
    var data = {
        appId: app.globalData.appId,
        nonceStr: createNonceStr(),
        package: 'prepay_id=' + prepay_id,
        signType: 'MD5',
        timeStamp: createTimeStamp()
    }
    data.paySign = createSign(data)
    return data
}

function createNonceStr() {
    return Math.random().toString(36).substr(2, 15)
}
function createOut_trade_no() {
    var date = new Date()
    var year = date.getFullYear()
    var month = createZero(date.getMonth() + 1)
    var nowData = createZero(date.getDate())
    var myData = year + "" + month + "" + nowData
    var num = ""
    for (var i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return myData + "" + num
}
function createZero(data) {
    if (data < 10) {
        data = '0' + data
    }
    return data
}
function createSign(data) {
    var string = raw(data)
    string = string + '&key=' + app.globalData.key
    string = utilMd5.hexMD5(string).toUpperCase()
    return string
}
function raw(args) {
    var keys = Object.keys(args)
    keys = keys.sort()
    var newArgs = {}
    keys.forEach(function (key) {
        newArgs[key] = args[key]
    })
    var string = ''
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
}
function createTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + ""
}

module.exports = {
    orderData: orderData,
    payData: payData
}