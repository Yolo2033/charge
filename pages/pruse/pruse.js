//cost()--跳转充值页面
//tabClick()--tab点击事件
//hasMoreUrl()--获取下拉加载所对应的URL
//hasMoreStar()--获取下拉加载所对应的star
//hasMore()--请求所对应记录
//onReachBottom()--下拉加载
var config = require('../../comm/script/config')
var app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    showLoading: false,
    hasMore: true,
    click: true,
    star: 0,
    star1: 0,
    recordData: [],
    recordData1: [],
    icon: "../../images/cost_icon.png",
    icon1: "../../images/cost_icon1.png",
    tabs: ["充值记录", "消费记录"],
    activeIndex: "0",
    sliderOffset: 0,
    sliderLeft: 0
  },
  onShow: function () {
    this.setData({
      star: 0,
      star1: 0,
      recordData: [],
      recordData1: []
    })
    var sessionId = wx.getStorageSync("sessionId")
    app.getUserDetail(this.setUserData, sessionId)
    this.p_onLoad()
  },
  p_onLoad: function () {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2
        });
      }
    })
    this.hasMore(sessionId)
  },
  cost: function () {
    wx.navigateTo({
      url: "../cost/cost",
    })
  },
  tabClick: function (e) {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
    switch (e.currentTarget.id) {
      case "1":
        if (that.data.click) {
          that.hasMore(sessionId)
          that.setData({
            click: false
          })
        }
        break;
    }
  },
  hasMoreUrl: function (index) {
    switch (index) {
      case '0':
        var url = config.urlChargeRecord
        break;
      case '1':
        var url = config.urlCostRecord
        break;
    }
    return url
  },
  hasMoreStar: function (index) {
    var that = this
    switch (index) {
      case '0':
        var star = that.data.star
        break;
      case '1':
        var star = that.data.star1
        break;
    }
    return star
  },
  hasMore: function (sessionId) {
    var that = this
    var url = this.hasMoreUrl(that.data.activeIndex)
    var data = {
      start: this.hasMoreStar(that.data.activeIndex),
      length: 15,
      sessionId: sessionId
    }
    that.setData({
      hasMore: true,
      showLoading: true
    })
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      success: function (res) {
        console.log(res)
        switch (res.data.error_code) {
          case 0:
            if (res.data.data.data != null) {
              if (that.data.activeIndex == '0') {
                that.data.star += res.data.data.data.length
                that.setData({
                  recordData: that.data.recordData.concat(res.data.data.data),
                  showLoading: false
                })
                console.log("充值记录开始---" + that.data.star)
              } else {
                that.data.star1 += res.data.data.data.length
                that.setData({
                  recordData1: that.data.recordData1.concat(res.data.data.data),
                  showLoading: false
                })
                console.log("消费记录开始---" + that.data.star1)
              }
            } else {
              that.setData({
                hasMore: false,
                showLoading: false
              })
            }
            break;
          case 40008:
            console.log("用户身份已过期")
            app.login(that.hasMore)
            break;
          case 60010:
            console.log("参数不合法")
            app.login(that.hasMore)
            break;
          case 60011:
            that.setData({ showLoading: false })
            wx.showToast({
              title: '无效的用户',
              icon: 'loading',
              duration: 1500
            })
            break;
          default:
            console.log("不知道的参数")
            break;
        }
      }
    })
  },
  onReachBottom: function () {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    var url = this.hasMoreUrl(this.data.activeIndex)
    switch (this.data.activeIndex) {
      case '0':
        var star = that.data.star
        break;
      case '1':
        var star = that.data.star1
        break;
    }
    if (this.data.showLoading != true) {
      this.hasMore(sessionId)
    }
  },
  setUserData: function (res) {
    this.setData({
      userData: res
    })
  }
})