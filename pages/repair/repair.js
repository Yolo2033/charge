// pages/repair/repair.js
var config = require('../../comm/script/config')
Page({
  data: {},
  formSubmit: function (e) {
    var that = this
    var dcNo = e.detail.value.dcNo
    var devPort = e.detail.value.devPort
    var diagnosis = e.detail.value.diagnosis
    var reg = /^\d{8,10}$/
    var reg1 = /^\d{1,2}$/

    if (!reg.test(dcNo)) {
      var title = '请输入正确的设备编号'
      that.toast(title)
      return
    }
    if (!reg1.test(devPort)) {
      var title = '请输入正确的端口'
      that.toast(title)
      return
    }
    if (diagnosis == '') {
      var title = '请正确描述故障'
      that.toast(title)
      return
    }
    if (filterSqlStr(diagnosis) == true) {
      wx.showToast({
        title: '提交内容包含敏感字符',
        icon: 'loading',
        duration: 1500
      })
      return
    }
    wx.request({
      url: config.urlChargeRepair,
      data: {
        dcNo: dcNo,
        devPort: devPort,
        diagnosis: diagnosis
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  toast: function (title) {
    wx.showToast({
      title: title,
      icon: 'loading',
      duration: 1500
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})

function filterSqlStr(value) {
  var sqlStr = sql_str().split(',');
  var flag = false;

  for (var i = 0; i < sqlStr.length; i++) {

    if (value.toLowerCase().indexOf(sqlStr[i]) != -1) {
      flag = true;
      break;

    }
  }
  return flag;
}

function sql_str() {
  var str = "and,delete,or,exec,insert,select,union,update,count,*,',join,>,<";
  return str;
}