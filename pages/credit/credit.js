//tabClick()--点击判断视图
//hasMore()--请求对应数据
//onReachBottom()--下拉加载
//hasMoreUpType()--获取请求对应的类型（消费/充值）
//hasMoreStar()--获取请求对应的star
var app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var config = require('../../comm/script/config')
Page({
  data: {
    star: 0,
    star1: 0,
    recordData: [],
    recordData1: [],
    click: true,
    hasMore: true,
    showLoading: false,
    icon: "../../images/cost_icon.png",
    icon1: "../../images/cost_icon1.png",
    tabs: ["我的积分", "消费积分"],
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
    this.c_onLoad()
  },
  c_onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2
        });
      }
    });
    var upType = this.hasMoreUpType(this.data.activeIndex)
    var star = this.hasMoreStar(this.data.activeIndex)
    this.hasMore(upType, star)
  },
  tabClick: function (e) {
    var that = this
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    var upType = this.hasMoreUpType(e.currentTarget.id)
    var star = this.hasMoreStar(e.currentTarget.id)
    switch (e.currentTarget.id) {
      case "1":
        if (that.data.click) {//如果点击为1(消费积分)拉取数据注销点击
          that.hasMore(upType, star)
          that.setData({
            click: false
          })
        }
        break;
    }
  },
  hasMore: function (upType, star) {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    that.setData({ hasMore: true, showLoading: true })
    wx.request({
      url: config.urlRecordList,
      data: {
        start: star,
        length: 15,
        upType: upType,
        sessionId: sessionId
      },
      method: 'POST',
      success: function (res) {
        switch (res.data.error_code) {
          case 0:
            if (res.data.data.length != 0) {
              if (that.data.activeIndex == '0') {
                that.data.star += res.data.data.length
                that.setData({
                  recordData: that.data.recordData.concat(res.data.data),
                  showLoading: false
                })
                console.log("积分开始---" + that.data.star)
              } else {
                that.data.star1 += res.data.data.length
                that.setData({
                  recordData1: that.data.recordData1.concat(res.data.data),
                  showLoading: false
                })
                console.log("消费开始---" + that.data.star1)
              }
            } else {
              that.setData({
                hasMore: false,
                showLoading: false
              })
            }
            break;
          case 60011:
            that.setData({ showLoading: false })
            wx.showToast({
              title: '无效的用户',
              icon: 'loading',
              duration: 1500
            })
            break;
        }

      }
    })
  },
  onReachBottom: function () {
    var that = this
    var upType = this.hasMoreUpType(this.data.activeIndex)
    switch (this.data.activeIndex) {
      case '0':
        var star = that.data.star
        break;
      case '1':
        var star = that.data.star1
        break;
    }
    if (this.data.showLoading != true) {
      this.hasMore(upType, star)
    }
  },
  hasMoreUpType: function (index) {
    switch (index) {
      case '0':
        var upType = '1'
        break;
      case '1':
        var upType = '2'
        break;
    }
    return upType
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
  setUserData: function (res) {
    this.setData({
      userData: res
    })
  }
})