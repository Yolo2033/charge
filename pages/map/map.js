//getCity()根据坐标获取当前城市
//controltap()地图层上的控件
//scanCode()扫描设备
//markers()请求地图层上附近设备标记点
var config = require('../../comm/script/config')
var app = getApp()
Page({
  data: {
    point: ''
  },
  onLoad: function () {
    this.getCity()
  },
  getCity: function () {
    var that = this
    wx.showNavigationBarLoading()
    app.getCity(function () {
      wx.setNavigationBarTitle({
        title: '首页 - ' + config.city
      })
      wx.hideNavigationBarLoading()
      wx.getSystemInfo({
        success: function (res) {
          that.markers(app.globalData.point)
          var controls = config.controls(res.windowWidth, res.windowHeight)
          that.setData({
            point: app.globalData.point,
            windowHeight: res.windowHeight,
            controls: controls
          })
        }
      })
    })
  },
  controltap: function (e) {
    switch (e.controlId) {
      case 1:
        this.mapCtx = wx.createMapContext('myMap')
        this.mapCtx.moveToLocation()
        break;
      case 2:
        this.scanCode()
        break;
      case 4:
        wx.navigateTo({
          url: "../chargeList/chargeList"
        })
        break;
      case 5:
        wx.navigateTo({
          url: "../usedChargeList/usedChargeList"
        })
        break;
    }
  },
  scanCode: function () {
    wx.scanCode({
      success: (res) => {
        var str = res.result
        var ret = str.split("=")[1]
        wx.setStorageSync('dcNum', ret)
        wx.switchTab({
          url: '../scanCharge/scanCharge'
        })
      }
    })
  },
  markers: function (point) {
    var that = this
    wx.request({
      url: config.urlNearList,
      data: {
        "category": 2,
        "longitude": point.longitude,
        "latitude": point.latitude
      },
      method: 'POST',
      success: function (res) {
        var arr = []
        var markers = res.data.data
        for (var k in markers) {
          arr[k] = {
            iconPath: "../../images/charging_1.png",
            id: parseInt(k),
            latitude: parseFloat(markers[k].latitude),
            longitude: parseFloat(markers[k].longitude),
            width: 30,
            height: 30
          }
        }
        that.setData({
          markers: arr
        })
        console.log("地图坐标")
        console.log(arr)
      }
    })
  },
  changeLocation: function () {
    var that = this
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.markers(res)
      }
    })
  }
})