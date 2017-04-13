//onPullDownRefresh()--下拉刷新
//onReachBottom()--上拉加载回调接口
//hasMore()--获取设备列表
//viewSearch()--搜索充电桩
//viewSocket()--获取弹出设备端口
//hideSocket()--隐藏弹出设备端口
var config = require('../../comm/script/config')
var app = getApp()
Page({
  data: {
    start: 0,
    hasMore: true,
    showLoading: true,
    arrToArr: true,
    socketData1: config.socketData,
    socketData: '',
    list: []
  },
  onPullDownRefresh: function () {
    this.setData({
      hasMore: true,
      showLoading: true,
      list: []
    })
    this.onLoad()
    wx.stopPullDownRefresh()//停止当前页面下拉刷新
  },
  onReachBottom: function () {
    var that = this
    var point = app.globalData.point
    that.setData({ hasMore: true })
    if (that.data.hasMore) {
      that.hasMore(point)
    }
  },
  viewSearch: function () {
    wx.scanCode({
      success: function (res) {
        console.log(res)
      },
      fail: function () {
        // fail
      }
    })
  },
  viewSocket: function (e) {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    var dcNo = e.currentTarget.dataset.dcno
    this.setData({ showLoading: true })
    console.log("设备编号--------" + dcNo)
    wx.request({
      url: config.urlPort,
      data: {
        "dcNo": dcNo,
        "sessionId": sessionId
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.error_code == '40008') {
          console.log("用户身份过期")
        } else {
          console.log("用户验证通过,弹出端口")
          var data = res.data.data.ports
          var result = []
          for (var i = 0, len = data.length; i < len; i += 4) {
            result.push(data.slice(i, i + 4));
          }
          that.setData({
            socketData: result,
            socket: true,
            dcNo: dcNo,
            orgName: res.data.data.orgName,
            dcName: res.data.data.dcName,
            showLoading: false
          })
        }
      }
    })
  },
  viewSocket1:function(){
    wx.showToast({
      title: '设备已禁用',
      icon: 'loading',
      duration: 1500
    })
  },
  hideSocket: function () {
    this.setData({ socket: false })
  },
  hasMore: function (point) {
    var that = this
    this.setData({ showLoading: true })
    wx.request({
      url: config.urlChargeList,
      data: { longitude: point.longitude, latitude: point.latitude, start: that.data.start, length: 5 },
      method: 'POST',
      success: function (res) {
        // console.log(res)
        var arrLength = res.data.data.length
        if (arrLength > 0) {
          that.setData({
            list: that.data.list.concat(res.data.data),
            showLoading: false
          })
          that.data.start += arrLength
        } else {
          that.setData({
            hasMore: false,
            showLoading: false
          })
        }
        console.log(that.data.start)
      },
      fail: function (err) {
        console.log(err)
        that.setData({
          showLoading: false
        })
      }
    })
  },
  free: function (e) {
    var that = this
    var cpPort = e.currentTarget.dataset.cpport
    var cpState = e.currentTarget.dataset.cpstate
    var orgName = this.data.orgName
    var dcName = this.data.dcName
    wx.navigateTo({
      url: "../socket/socket?cpPort=" + cpPort + "&dcName=" + dcName + "&cpState=" + cpState + "&dcNo=" + that.data.dcNo + "&orgName=" + orgName
    })
    console.log("选中端口号" + cpPort + "设备编号" + that.data.dcNo)
  },
  used: function () {
    wx.showToast({
      title: '端口使用中',
      icon: 'loading',
      duration: 1000
    })
  },
  locking: function () {
    wx.showToast({
      title: '端口已锁定',
      icon: 'loading',
      duration: 1000
    })
  },
  fault: function () {
    wx.showToast({
      title: '端口已故障',
      icon: 'loading',
      duration: 1000
    })
  },
  onLoad: function () {
    var that = this
    this.setData({ start: 0 })
    var point = app.globalData.point
    this.hasMore(point)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ windowHeight: res.windowHeight })
      }
    })
  },
  onHide: function () {
    // 页面隐藏
    this.setData({
      socket: false
    })
  }
})