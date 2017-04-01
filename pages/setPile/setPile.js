// pages/setPile/setPile.js
var config = require('../../comm/script/config')
Page({
  data: {
    loading: '',
    category_index: 0,
    category: [
      { id: 2, name: '电瓶车充电桩' }
    ],
    dcType_index: 0,
    dcType: [
      { id: 6, name: '快速充电桩' }
    ],
    proId_index: 0,
    proId: [
      { id: 1, name: '福建逸充物联网科技有限公司' }
    ]
  },
  formSubmit: function (e) {
    var that = this
    var data = {
      contacter: e.detail.value.contacter,
      telephone: e.detail.value.telephone,
      address: e.detail.value.address
    }
    if (e.detail.value.contacter == "") {
      var title = "联系人不能为空"
      that.showToast(title)
      return
    }
    if (!this.checkMobile(e.detail.value.telephone)) {
      var title = "请输入正确手机号码"
      that.showToast(title)
      return
    }
    if (e.detail.value.address == "") {
      var title = "联系地址不能为空"
      that.showToast(title)
      return
    }
    if (filterSqlStr(e.detail.value.contacter) == true || filterSqlStr(e.detail.value.telephone) == true || filterSqlStr(e.detail.value.address) == true) {
      wx.showToast({
        title: '提交内容包含敏感字符',
        icon: 'loading',
        duration: 1500
      })
      return
    }
    this.setData({ loading: true })
    wx.request({
      url: config.urlBuildingPile,
      data: data,
      method: 'POST',
      success: function (res) {
        if (res.data.error_code == "0") {
          wx.showToast({
            title: "提交成功",
            icon: 'success',
            duration: 1500
          })
          that.setData({ loading: false })
        }
      }
    })
  },
  checkMobile: function (str) {
    var re = /^1\d{10}$/
    if (re.test(str)) {
      return str
    } else {
      return false
    }
  },
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'loading',
      duration: 1500
    })
    this.setData({ loading: false })
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