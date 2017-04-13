//radioChange()--支付方式
//selInput()--选择自定义
//inputChange()--输入自定义金额
//cost()--选中充值金额
//formSubmit()--表单提交充值
// var pay = require('../../comm/script/pay')
var app = getApp()
var config = require('../../comm/script/config')
Page({
  data: {
    selInput: true,
    valInput: "",
    wx_icon: '../../images/wx.png',
    list: [
      { name: "10" },
      { name: "20" },
      { name: "30" }
    ],
    radioItems: [
      { name: "微信支付", value: '1', checked: true }//{ name: "微信支付", value: '2'}
    ],
    loading: false,
    disabled: false,
    price: ""
  },
  onLoad: function () {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    wx.request({
      url: config.urlChargeConfig + sessionId,
      data: '',
      method: 'GET',
      success: function (res) {
        that.setData({
          chargeData: res.data.data
        })
      },
      fail: function (err) {

      }
    })
  },
  radioChange: function (e) {
    //支付方式
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },
  selInput: function () {
    this.setData({ selInput: false })
    var list = this.data.list
    for (var i = 0, len = list.length; i < len; ++i) {
      list[i].color = ""
    }
    this.setData({ list: list, price: "" })
  },
  inputChange: function (e) {
    this.setData({ valInput: e.detail.value, price: e.detail.value })
  },
  cost: function (e) {
    this.setData({ selInput: true });
    var list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].name == e.target.dataset.money) {
        list[i].color = "selColor"
        this.setData({ price: e.target.dataset.money })
      } else {
        list[i].color = ""
      }
    }
    this.setData({ list: list })
    console.log("当前选中金额----" + e.target.dataset.money)
  },
  formSubmit: function (e) {
    var that = this
    var sessionId = wx.getStorageSync('sessionId')
    this.setData({
      loading: true
    })
    var formData = e.detail.value
    if (formData.price == "") {
      wx.showToast({
        title: '请确认充值金额',
        icon: 'loading',
        duration: 1500,
        success: function () {
          that.setData({
            loading: false
          })
        }
      })
    } else {
      var sessionId = ""
      that.successCharge(sessionId)
    }
  },
  pay: function (res) {
    var that = this
    wx.requestPayment({
      timeStamp: res.timeStamp,
      nonceStr: res.nonceStr,
      package: res.package,
      signType: res.signType,
      paySign: res.paySign,
      success: function (res) {
        wx.showToast({
          title: '充值成功',
          icon: 'success',
          duration: 1500,
          success: function () {
            that.setData({
              loading: false
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '支付取消',
          icon: 'loading',
          duration: 1500,
          success: function () {
            that.setData({
              loading: false
            })
          }
        })
      }
    })
  },
  successCharge: function (sessionId) {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    var amount = that.data.price
    wx.request({
      url: config.urlCharge,
      data: { amount: amount, sessionId: sessionId },
      method: 'POST',
      success: function (res) {
        switch (res.data.error_code) {
          case 0:
            that.pay(res.data.data)
            break;
          case 60010:
            console.log("常数不合法")
            break;
          case 60011:
            wx.showToast({
              title: '用户不存在',
              icon: 'loading',
              duration: 1500
            })
            break;
          case 40008:
            app.login(that.successCharge)
            console.log("身份过期")
            break;
        }
      },
      fail: function (err) {

      }
    })
  }
})