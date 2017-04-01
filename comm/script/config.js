/*
备注
city: 城市（在程序载入时获取一次）
count: 返回结果数量
baiduAK: 百度地图AK
apiList: api列表
skinList: “个人中心”页面背景列表
controls:map上的控件
*/
var app = getApp();
function controls(width, height) {
    var data = [{
        id: 1,
        iconPath: '../../images/location.png',
        position: { left: 20, top: height - 50, width: 30, height: 30 },
        clickable: true
    },
    {
        id: 2,
        iconPath: '../../images/scan.png',
        position: { left: width / 2 - 27.5, top: height - 60, width: 55, height: 55 },
        clickable: true
    },
    {
        id: 3,
        iconPath: '../../images/location_1.png',
        position: { left: width / 2 - 15, top: height / 2 - 15, width: 30, height: 30 },
        clickable: false
    },
    {
        id: 4,
        iconPath: '../../images/list.png',
        position: { left: width - 50, top: 20, width: 45, height: 45 },
        clickable: true
    }
    ]
    return data
}
var url = "https://wx.eeyycc.cn/"
module.exports = {
    urlPort: url + 'api/v1/user/charge/port',
    urlChargeList: url + 'api/v1/dev/charge/list',
    urlCharge: url + 'api/v1/user/account/charge',
    urlRecordList: url + 'api/v1/user/point/record/list',
    urlNearList: url + 'api/v1/dev/charge/nearby/list',
    urlAddProblem: url + 'api/v1/user/feedback/add',
    urlChargeRecord: url + 'api/v1/user/charge/record',
    urlCostRecord: url + 'api/v1/user/cost/record',
    urlDevCharging: url + 'api/v1/user/dev/charging?sessionId=',
    urlDevStop: url + 'api/v1/user/dev/stop',
    urlBuildingPile: url + 'api/v1/buildingPile/add',
    urlOrgConfig: url + 'api/v1/org/config/',
    urlDealAgree: url + 'api/v1/user/deal/agree',
    urlAccountPay: url + 'api/v1/user/account/pay',
    urlDealAdd: url + 'api/v1/user/deal/add',
    urlUsedList: url + 'api/v1/device/charge/used/list?sessionId=',
    urlDecodeUserInfo: url + 'api/v1/decodeUserInfo',
    urlGetSession: url + 'api/v1/getSession',
    urlAccountDetail: url + 'api/v1/user/account/detail',
    urlChargeRepair: url + 'api/v1/device/charge/repair',
    urlWxPay: url + 'api/v1/user/charge/wx/pay',
    urlChargeConfig: url + 'api/v1/user/charge/config/list?sessionId=',
    city: '',
    point: '',
    baiduAK: 'Y1R5guY8Y2GNRdDpLz7SUeM3QgADAXec',
    apiList: {
        baiduMap: 'https://api.map.baidu.com/geocoder/v2/'
    },
    controls: controls,
    entering: [
        { name: "名称", data: "dcName", value: "快速充电桩" },
        { name: "型号", data: "model" },
        { name: "端口数", data: "port" }
    ],
    timeData: [
        {
            id: 1,
            time: [{ "id": 0, "time": "充满自停", "amount": 100 }, { 'id': 1, 'time': "2小时", "amount": 80 }, { 'id': 2, 'time': "4小时", "amount": 100 }]
        },
        {
            id: 2,
            time: [{ "id": 3, "time": "6小时", "amount": 150 }, { "id": 4, "time": "8小时", "amount": 200 }]
        }
    ]
}
// 1 0.8 1 1.5 2 