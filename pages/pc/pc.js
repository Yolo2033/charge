var app = getApp();
Page({
  data: {
    gridList: [
      { enName: 'pruse', zhName: '我的钱包' },
      { enName: 'credit', zhName: '我的积分' },
      { enName: 'setPile', zhName: '我要建桩' },
      { enName: 'userGuide', zhName: "用户指南" },
      { enName: 'about', zhName: "关于我们" },
      { enName: 'repair', zhName: "一键报修" },
      { enName: 'problem', zhName: "问题反馈" }
    ],
    skin: 'http://myh.yibj.cc/pc/user_bg_1.jpg'
  },
  onLoad: function () {
    var that = this
    console.log("用户信息")
    // 检测是否存在用户信息
    if (app.globalData.userInfo != null) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.getUserInfo()
    }
    // typeof cb == 'function' && cb()
  },
  viewGridDetail: function (e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: "../" + data.url + '/' + data.url
    })
  },
  onShow: function () {
  }
})