//onLaunch()--监听小程序初始化（全局只触发一次）
//login()--调用接口获取登录凭证（code）
//getSystemInfo()--获取系统信息
//getUserInfo()--获取用户信息
//getDecodeUserInfo()--获取解密用户信息
//getCity()--根据坐标换取城市
//getSession()--获取sessionId
//getUserDetail()--获用户账户信息
var config = require('comm/script/config')
App({
  globalData: {
    userInfo: null,
    point: '',
    appId: 'wx7ba70ead3cf568cd',
    mch_id: '1438876902',
    key: 'fhksvaiigirztnkmfvlyugnsofhupoew',
    secret: "bc7083ca6c4e22cd668f09afe697daed"
  },
  onLaunch: function () {
    // this.sessionSaveLogin()
    this.login(this.getUserInfo)
    this.getSystemInfo()
  },
  sessionSaveLogin: function () {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    wx.login({
      success: function (data) {
        that.getUserInfo(sessionId)
      }
    })
  },
  login: function (cb, key, key1) {
    var that = this
    wx.login({
      success: function (data) {
        var code = data.code
        that.getSession(cb, code, key, key1)
      },
      fail: function (err) {
        console.log("login-----拒绝")
        // that.login()
      }
    })
  },
  getUserInfo: function (sessionId) {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        var iv = res.iv
        var encryptedData = res.encryptedData
        var userInfo = res.userInfo
        that.globalData.userInfo = userInfo
        typeof cb == "function" && cb(userInfo)
        that.getDecodeUserInfo(encryptedData, iv, sessionId)
      },
      fail: function (err) {
        wx.showToast({
          title: '用户拒绝授权',
          icon: 'loading',
          duration: 2000
        })
        console.log(err)
      }
    })
  },
  getDecodeUserInfo: function (encryptedData, iv, sessionId) {
    var that = this
    wx.request({
      url: config.urlDecodeUserInfo,
      data: {
        encryptedData: encryptedData,
        iv: iv,
        sessionId: sessionId
      },
      method: 'GET',
      success: function (res) {
        switch (res.data.error_code) {
          case 0:
            console.log("解密数据成功----")
            wx.setStorageSync('openId', res.data.data.openId)
            break;
          case 40008:
            console.log("解密身份过期----")
            that.login(that.getUserInfo)
            break;
          case 50021:
            console.log("解密失败----")
            that.login(that.getUserInfo)
            break;
          default:
            console.log("未知--------")
            break;
        }
      },
      fail: function (err) {
        console.log("userinfo---拒绝")
      }
    })
  },
  getCity: function (cb) {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var locationParam = res.latitude + ',' + res.longitude + '1'
        that.globalData.point = res
        config.point = that.globalData.point
        wx.request({
          url: config.apiList.baiduMap,
          data: {
            ak: config.baiduAK,
            location: locationParam,
            output: 'json',
            pois: '1'
          },
          method: 'GET',
          success: function (res) {
            config.city = res.data.result.addressComponent.city.slice(0, -1)
            typeof cb == "function" && cb(res.data.result.addressComponent.city.slice(0, -1))
          },
          fail: function (res) {
            // 重新定位
            that.getCity();
          }
        })
      }
    })
  },
  getSession: function (cb, code, key, key1) {
    var that = this
    wx.request({
      url: config.urlGetSession,
      data: {
        wxCode: code
      },
      method: 'GET',
      success: function (res) {
        wx.setStorageSync('sessionId', res.data.data.sessionId)
        cb(res.data.data.sessionId, key, key1)
      }
    })
  },
  getSystemInfo: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        config.windowHeight = res.windowHeight
        config.windowWidth = res.windowWidth
      }
    })
  },
  getUserDetail: function (cb, sessionId) {
    var that = this
    wx.request({
      url: config.urlAccountDetail,
      data: {
        sessionId: sessionId
      },
      method: 'GET',
      success: function (res) {
        cb(res.data.data)
      }
    })
  }
})
