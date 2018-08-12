import {
  colorList,
  switchColorList,
  lightColorList,
  lightColor,
  statusText,
  shareInfo
} from './Config.js'
import Config  from './Config.js'
console.log(Config)
var num = 0
const getRanColor = function () {
  var len = colorList.length - 1
  var color = colorList[num]
  num < len ? num++ : num = 0
  return color
}
// 根据灯位置获取颜色
const getColorByIndex = function (index) {
  var cIndex = typeof index === 'number' ? index % colorList.length : 0
  return colorList[cIndex]
}
// 根据装填获取颜色
const getColorBySwitchStatus = function (status) {
  if(typeof status !== 'number') return switchColor[3]
  var index = status % switchColorList.length
  return switchColorList[index]
}
// 根据装填获取颜色
const getColorByLightStatus = function (status) {
  if(typeof status !== 'number') return lightColorList[1]
  var index = status % lightColorList.length
  return lightColorList[index]
}
// 开关类
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
// 等类
const Light = function (index) {
  this.id = Math.random(0,1).toString(36).slice(2)
  this.name = '灯' + (index + 1).toString()
}

const createSwitch = function (dev) {
  return new Switch(dev)
}
// 转发
const share = function () {
  return shareInfo
}

export default {
  getRanColor,
  getColorBySwitchStatus,
  getColorByLightStatus,
  createSwitch,
  statusText,
  lightColor,
  getColorByIndex,
  share
}
