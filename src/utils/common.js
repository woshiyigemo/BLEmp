// 颜色获取
const colorList = [
  '#9bd90a', // 0已连接
  '#ffb400', // 1未连接
  '#fd5d51', // 2新设备
  '#999999' // 3离线
]
// 颜色获取
const swtichColorList = [
  '#9bd90a', // 0已连接
  '#ffb400', // 1未连接
  '#fd5d51', // 2新设备
  '#999999' // 3离线
]
// 灯状态拾色器
const lightColorLightList = [
  '#9bd90a', // 打开
  '#ffb400' // 关闭
]
// 等状态文案
const statusText = {
  0: '已连接', // 已连接
  1: '未连接', // 有历史记录且未连接
  2: '新设备', // 无历史记录且未连接
  3: '离线' // 有历史记录且未未扫描到
}
const statusColor = {
  0: '#9bd90a', // 0已连接
  1: '#ffb400', // 1未连接
  2: '#fd5d51', // 2新设备
  3: '#999999' // 3离线
}
var num = 0
const getRanColor = function () {
  var len = colorList.length - 1
  var color = colorList[num]
  num < len ? num++ : num = 0
  return color
}
const getColorByIndex = function (index) {
  var cIndex = typeof index === 'number' ? index % colorList.length : 0
  return colorList[cIndex]
}
// 根据装填获取颜色
const getColorBySwitchStatus = function (status) {
  if(typeof status !== 'number') return swtichColorList[3]
  var index = status % swtichColorList.length
  return swtichColorList[index]
}
// 根据装填获取颜色
const getColorByLightStatus = function (status) {
  if(typeof status !== 'number') return lightColorLightList[1]
  var index = status % lightColorLightList.length
  return lightColorLightList[index]
}
const deleteSwitch = function (devId, switchList) {
  for (var i = switchList.length - 1; i >= 0; i--) {
    if (switchList[i].deviceId === devId) {
      switchList.splice(i, 1)
      break
    }
  }
}
const Switch = function (dev) {
  this.localName = dev.localName || dev.name || Math.random().toString()
  this.name = dev.name
  this.deviceId = dev.deviceId
  this.status = 2 // 新设备状态
  // this.mute = 1 // 静音
  // this.backlightStrong = 1 // 强背光
  // this.backlightWeek = 1 // 弱背光
  // this.signalStrong = 0 // 增强信号
  // this.version = '0.0' // 默认版本号
  this.lightList = [new Light(0), new Light(1), new Light(2), new Light(3)]
}
const Light = function (index) {
  this.id = Math.random(0,1).toString(36).slice(2)
  this.color = getColorByIndex(index)
  this.name = '灯' + (index + 1).toString()
}

const createSwitch = function (dev) {
  return new Switch(dev)
}

// 特征值列表
const SampleGattAttributes = {
  FREE: '0000180a-0000-1000-8000-00805f9b34fb'.toUpperCase(),
  OAD_SERVICE: 'f000ffc0-0451-4000-b000-000000000000'.toUpperCase(), // 服务
  OAD_IMAGE_NOTIFY_CHAR: 'f000ffc1-0451-4000-b000-000000000000'.toUpperCase(), // 查询版本，发送升级通知
  OAD_BLOCK_REQUEST_CHAR: 'f000ffc2-0451-4000-b000-000000000000'.toUpperCase(), // 发送升级文件
  OAD_IMAGE_STATUS_CHAR: 'f000ffc4-0451-4000-b000-000000000000'.toUpperCase(),
  HEART_RATE_MEASUREMENT: '00002a37-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 测温
  CLIENT_CHARACTERISTIC_CONFIG: '00002902-0000-1000-8000-00805f9b34fb'.toUpperCase(),
  SIMPLEIO_SERVICE: '0000fff0-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 设备特征值
  SIMPLEIO_CHAR1_CHARACTERISTIC: '0000fff1-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 灯1/2/3/4/
  SIMPLEIO_CHAR2_CHARACTERISTIC: '0000fff2-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 灯状态/静音/背景光
  SIMPLEIO_CHAR4_CHARACTERISTIC: '0000fff4-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 灯3
  SIMPLEIO_CHAR5_CHARACTERISTIC: '0000fff5-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 灯4
  RESET_SERVICE: 'f000ffd0-0451-4000-b000-000000000000'.toUpperCase(), // 重启
  RESET_CHARACTERISTIC: 'f000ffd1-0451-4000-b000-000000000000'.toUpperCase()
}
// 转发
const share = function () {
  return {
    title: 'LoLar-开启智慧生活第一步',
    path: '/pages/switchList',
    imageUrl: '../images/static/thumb.png'
  }
}

export default {
  SampleGattAttributes,
  getRanColor,
  getColorBySwitchStatus,
  getColorByLightStatus,
  createSwitch,
  deleteSwitch,
  statusText,
  statusColor,
  share
}
