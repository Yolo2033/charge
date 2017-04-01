//onShow()--页面显示加载--viewSocket()--弹出设备端口--userChargedType()获取用户是否充电状态
//userChargedType()--获取用户是否充电状态
//stopCharge()--停止设备充电
//scanCode()--微信扫码API
//viewSocket()--弹出设备端口
//hideSocket()--隐藏设备端口模板
//free()--空闲端口
//used()--使用端口
//locking()--锁定端口
//fault()--故障端口
//onHide()--页面隐藏
//onUnload()--页面关闭
//updateTimer()--渲染倒计时时钟
var app = getApp()
var util = require('../../utils/util.js')
var config = require('../../comm/script/config')
var timer = null


const initDeg = {
  left: 45,
  right: -45,
}
Page({
  data: {
    clock: '',
    dcNo: '',
    chargeType: true,
    src: "../../images/device-none.png",
    text: "请扫描充电桩屏幕上的二维码\n当前只支持车充电e的充电桩",
    remainTimeText: '',
    log: {},
    completed: false,
    showLoading: false,
    isRuning: false,

    leftDeg: initDeg.left,
    rightDeg: initDeg.right
  },
  onShow: function () {
    var sessionId = wx.getStorageSync("sessionId")
    this.userChargedType(sessionId)
  },
  userChargedType: function (sessionId) {
    var that = this
    this.setData({ total_micro_second: 0 })
    wx.request({
      url: config.urlDevCharging + sessionId,
      data: "",
      method: 'GET',
      success: function (res) {
        switch (res.data.error_code) {
          case 40008:
            console.log("扫码界面--身份过期")
            app.login(that.userChargedType)
            break;
          case 0:
            if (res.data.data.dcNo) {
              let keepTime = res.data.data.planTime * 1000
              let startTime = new Date(res.data.data.startTime.replace(/-/g, "/")).getTime()
              let endTime = startTime + keepTime
              that.setData({
                completed: false,
                chargeType: false,
                socket: false,
                remainTimeText: "--:--",
                dcPort: res.data.data.dcPort,
                dcNo: res.data.data.dcNo
              })
              that.data.log = {
                startTime: startTime,
                keepTime: keepTime,
                endTime: endTime,
              }
              that.timer = setInterval((function () {
                that.updateTimer()
                that.startNameAnimation()
              }).bind(that), 1000)
              console.log("正在充电界面")
            } else {
              console.log("当前为扫码界面")
              that.setData({ chargeType: true })
            }
            break;
        }
      }
    })
  },
  stopCharge: function () {
    var that = this
    var data = {
      dcNo: this.data.dcNo,
      devPort: this.data.dcPort,
      sessionId: wx.getStorageSync("sessionId")
    }
    console.log(data)
    wx.request({
      url: config.urlDevStop,
      data: data,
      method: 'GET',
      success: function (res) {
        console.log("停止充电")
        console.log(res)
        that.setData({
          leftDeg: initDeg.left,
          rightDeg: initDeg.right
        })
        that.timer && clearInterval(that.timer)
        that.setData({ chargeType: true })
      }
    })
  },
  scanCode: function () {
    var that = this
    var sessionId = ""//占位作用
    // that.viewSocket(sessionId, 34567655)
    wx.scanCode({
      success: (res) => {
        var str = res.result
        var ret = str.split("=")[1]
        that.viewSocket(sessionId, ret)
      }
    })
  },
  viewSocket: function (sessionId, dcNo) {
    var that = this
    var sessionId = wx.getStorageSync("sessionId")
    this.setData({ showLoading: true })
    wx.request({
      url: config.urlPort,
      data: {
        "dcNo": dcNo,
        "sessionId": sessionId
      },
      method: 'GET',
      success: function (res) {
        switch (res.data.error_code) {
          case 40008:
            console.log("端口--用户身份过期")
            app.login(that.viewSocket, dcNo)
            break;
          case 0:
            console.log("端口--有数据")
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
              dcName: res.data.data.dcName
            })
            break;
        }
        that.setData({ showLoading: false })
      }
    })
  },
  hideSocket: function () {
    this.setData({ socket: false })
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
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  //--充电中界面
  startNameAnimation: function () {
    let animation = wx.createAnimation({
      duration: 450
    })
    animation.opacity(0.2).step()
    animation.opacity(1).step()
    this.setData({
      nameAnimation: animation.export()
    })
  },

  stopTimer: function () {
    // reset circle progress
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right
    })

    // clear timer
    this.timer && clearInterval(this.timer)
  },

  updateTimer: function () {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = util.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    let halfTime

    // update text
    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })
      this.stopTimer()
      return
    }
    // update circle progress
    halfTime = log.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
      })
    }
  },
  onHide: function () {
    // 页面隐藏
    this.setData({
      socket: false
    })
  },
  onUnload: function () {
    // 页面关闭
    this.setData({
      socket: false
    })
  }
})