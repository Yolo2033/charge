// pages/usedChargeList/usedChargeList.js
var config = require('../../comm/script/config')
Page({
  data: {
    list: [],
    showLoading: false
  },
  onLoad: function () {
    var that = this
    var sessionId = wx.getStorageSync('sessionId')
    this.setData({ showLoading: true })
    wx.request({
      url: config.urlUsedList + sessionId,
      data: '',
      method: 'GET',
      success: function (res) {
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              windowHeight: res.windowHeight
            })
          }
        })
        if (res.data.data.length != 0) {
          that.setData({
            list: res.data.data,
            showLoading: false,
            hasList: true
          })
        } else {
          that.setData({ hasList: false, showLoading: false })
        }
      }
    })
  },
  toMap: function () {
    wx.navigateTo({
      url: "../map/map"
    })
  },
  showSocket: function (e) {
    this.setData({ showLoading: true })
    var that = this
    var dcNo = e.currentTarget.dataset.dcno
    var data = {
      dcNo: dcNo,
      sessionId: wx.getStorageSync("sessionId")
    }
    wx.request({
      url: config.urlPort,
      data: data,
      method: 'GET',
      success: function (res) {
        switch (res.data.error_code) {
          case 40008:
            console.log("身份过期")
            break;
          case 0:
            console.log("弹出端口")
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
            break;
        }
      }
    })
  },
  hideSocket: function () {
    this.setData({ socket: false })
  },
  free: function (e) {
    var that = this
    var dcNo = that.data.dcNo
    var cpPort = e.currentTarget.dataset.cpport
    var cpState = e.currentTarget.dataset.cpstate
    var orgName = this.data.orgName
    var dcName = this.data.dcName
    wx.navigateTo({
      url: "../socket/socket?cpPort=" + cpPort + "&dcName=" + dcName + "&cpState=" + cpState + "&dcNo=" + dcNo + "&orgName=" + orgName
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
  onHide: function () {
    // 页面隐藏
    this.setData({
      socket: false
    })
  }
})