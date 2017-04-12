//onLoad()页面初始化（页面加载执行一次）
//getTime()获取设备充电时间
//selTime()选择充电时间
//openCharging()准备开始充电
//getAgreement()--获取用户是否同意协议/payRequest()--发起支付请求/wxPay()--发起微信支付请求
//payRequest()--发起支付请求
//wxPay()--统一下单/orderData()--获取统一下单签名数据/createFromData()--拼接xml数据/getXMLNodeValue()--截取统一下单订单编号/pay()--发起支付请求/
//pay()--发起支付请求/payData()--再次签名（获取支付签名）/
//createFromData()--拼接xml数据
//getXMLNodeValue()--截取统一下单订单编号
//agreement()--发起新增用户请求（同意协议）
var pay = require('../../comm/script/pay')
var config = require('../../comm/script/config')
var app = getApp()
Page({
  data: {
    agreement: false,
    agreementType: false,
    amount: '',
    chargedTime: ''
  },
  onShow: function () {
    var sessionId = wx.getStorageSync("sessionId")
    app.getUserDetail(this.setUserData, sessionId)
  },
  onLoad: function (options) {
    var that = this
    var data = {
      dcName: options.dcName,
      cpPort: parseInt(options.cpPort),
      cpState: parseInt(options.cpState),
      dcNo: parseInt(options.dcNo),
      orgName: options.orgName
    }
    this.setData({
      data: data
    })
    this.getTime(parseInt(options.dcNo))
  },
  getTime: function (dcNo) {
    var that = this
    wx.request({
      url: config.urlOrgConfig + dcNo,
      data: "",
      method: 'GET',
      success: function (res) {
        var result = []
        for (var i = 0, len = res.data.data.length; i < len; i += 3) {
          result.push(res.data.data.slice(i, i + 3));
        }
        that.setData({ timeData: result })
      }
    })
  },
  selTime: function (e) {
    var data = this.data.timeData
    for (var k in data) {
      for (var x in data[k]) {
        if (e.currentTarget.dataset.ocid == data[k][x].ocId) {
          data[k][x].color = "selColor"
          this.setData({ amount: data[k][x].ocAmount })
          console.log(data[k][x].ocAmount)
        } else {
          data[k][x].color = ''
        }
      }
    }
    this.setData({ timeData: data })
    console.log("充电时间对应的金额" + this.data.amount + "元")
  },
  openCharging: function (e) {
    var that = this
    if (this.data.amount == "") {
      wx.showToast({
        title: '请选择充电时间',
        icon: 'loading',
        duration: 1000
      })
    } else {
      var sessionId = ''//第一个参数为sessionId，但是用不到（可是要传）
      that.getAgreement(sessionId, e)
    }
  },
  getAgreement: function (sessionId, e) {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    wx.request({
      url: config.urlDealAgree,
      data: { sessionId: sessionId },
      method: 'GET',
      success: function (res) {
        switch (res.data.error_code) {
          case 60011:
            wx.showToast({
              title: '用户不存在',
              icon: 'loading',
              duration: 1500
            })
            break;
          case 40008:
            app.login(that.getAgreement, e)
            break;
          case 0:
            switch (res.data.data) {
              case 0:
                wx.showModal({
                  title: '用户协议',
                  content: '阅读用户协议',
                  success: function (res) {
                    if (res.confirm) {
                      that.setData({ agreementType: true, agreement: true })
                    }
                  }
                })
                break;
              case 1:
                switch (e.currentTarget.dataset.type) {
                  case '1':
                    wx.showModal({
                      title: '余额支付',
                      content: '确认支付' + that.data.amount + "元",
                      success: function (res) {
                        if (res.confirm) {
                          var sessionId = ''//回掉函数占位作用
                          that.payRequest(sessionId, 1, that.data.amount)
                        }
                      }
                    })
                    break;
                  case '2':
                    wx.showModal({
                      title: '积分支付',
                      content: '确认支付' + that.data.amount * 100 + "积分",
                      success: function (res) {
                        if (res.confirm) {
                          var sessionId = ''//回掉函数占位作用
                          that.payRequest(sessionId, 2, that.data.amount * 100)
                        }
                      }
                    })
                    break;
                  case '3':
                    var sessionId = ''//回掉函数占位作用
                    console.log("微信支付")
                    that.wxPay(sessionId, 3, that.data.amount)
                    break;
                }
                break;
            }
            break;
        }
      }
    })
  },
  payRequest: function (sessionId, payType, amount) {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    var payData = {
      sessionId: sessionId,
      amount: amount,
      payType: payType,
      dcNo: this.data.data.dcNo,
      dcPort: this.data.data.cpPort
    }
    wx.request({
      url: config.urlAccountPay,
      data: payData,
      method: 'POST',
      success: function (res) {
        switch (res.data.error_code) {
          case 60010:
            var iconType = "loading"
            app.login(that.payRequest, payType, amount)
            break;
          case 60021:
            var iconType = "loading"
            break;
          case 60022:
            var iconType = "loading"
            break;
          case 60032:
            var iconType = "loading"
            break;
          case 60037:
            var iconType = "loading"
            break;
          case 60038:
            var iconType = "loading"
            break;
          case 40008:
            var iconType = "loading"
            app.login(that.payRequest, payType, amount)
            break;
          case 60011:
            var iconType = "loading"
          case 0:
            var iconType = "success"
            wx.showToast({
              title: res.data.msg,
              icon: iconType,
              duration: 1000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../scanCharge/scanCharge'
              })
            }, 1000);
            wx.setStorageSync('chargingOk', true)
            break;
          // default:
          //   var iconType = "success"
        }
        wx.showToast({
          title: res.data.msg,
          icon: iconType,
          duration: 1000
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '端口开启失败，充电失败',
          icon: 'loading',
          duration: 1000
        })
        console.log(err)
      }
    })
  },
  wxPay: function (sessionId, payType, amount) {
    var that = this
    var data = {
      sessionId: wx.getStorageSync("sessionId"),
      amount: amount,
      payType: payType,
      dcNo: this.data.data.dcNo,
      dcPort: this.data.data.cpPort
    }
    wx.request({
      url: config.urlWxPay,
      data: data,
      method: 'POST',
      success: function (res) {
        switch (res.data.error_code) {
          case 60010:
            var iconType = "loading"
            break;
          case 60021:
            var iconType = "loading"
            break;
          case 60022:
            var iconType = "loading"
            break;
          case 60032:
            var iconType = "loading"
            break;
          case 60037:
            var iconType = "loading"
            break;
          case 60038:
            var iconType = "loading"
            break;
          case 40008:
            var iconType = "loading"
            break;
          case 0:
            var iconType = "success"
            that.pay(res.data.data)
            break;

        }
        wx.showToast({
          title: res.data.msg,
          icon: iconType,
          duration: 1500
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  pay: function (data) {
    var that = this
    wx.requestPayment({
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': data.signType,
      'paySign': data.paySign,
      'success': function (res) {
        wx.switchTab({
          url: '../scanCharge/scanCharge'
        })
      },
      'fail': function (res) {
        console.log(res)
      }
    })
  },
  agreement: function (sessionId) {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    wx.request({
      url: config.urlDealAdd,
      data: { sessionId: sessionId, isAgree: 1 },
      method: 'POST',
      success: function (res) {
        console.log(res)
        switch (res.data.error_code) {
          case 40008:
            app.login(that.agreement)
            break;
          case 60010:
            app.login(that.agreement)
            break;
          case 0:
            that.setData({ agreementType: false })
            break;
        }
      }
    })
  },
  setUserData: function (res) {
    this.setData({
      userData: res
    })
  }
})
