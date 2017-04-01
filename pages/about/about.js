// pages/about/about.js
Page({
  data: {
    width: '',
    height: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height:res.windowHeight
        })
        console.log(res.windowWidth)
        console.log(res.windowHeight)
      }
    })
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