// pages/problem/problem.js
var config = require('../../comm/script/config')
Page({
  data: {
    dcType_index: 0,
    dcType: [
      { id: 1, name: '建议' },
      { id: 2, name: 'BUG反馈' },
      { id: 3, name: '投诉' },
      { id: 4, name: '充值' },
      { id: 5, name: '其他' }
    ],
    pickerType: true
  },
  bindPickerChange: function (e) {
    this.setData({
      pickerType: false,
      dcType_index: e.detail.value
    })
  },
  formSubmit: function (e) {
    var problemId = e.detail.value.problemId
    var problemDetail = e.detail.value.problemDetail
    if (this.data.pickerType == true || problemId == '') {
      wx.showToast({
        title: '请选择问题类型',
        icon: 'loading',
        duration: 1500
      })
      return
    }
    if (problemDetail == '') {
      wx.showToast({
        title: '问题描述不能为空',
        icon: 'loading',
        duration: 1500
      })
      return
    }
    if (filterSqlStr(problemDetail) == true) {
      wx.showToast({
        title: '提交内容包含敏感字符',
        icon: 'loading',
        duration: 1500
      })
      return
    }
    wx.request({
      url: config.urlAddProblem,
      data: { fdType: problemId, description: problemDetail },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: "提交成功",
          icon: 'success',
          duration: 1500
        })
      }
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