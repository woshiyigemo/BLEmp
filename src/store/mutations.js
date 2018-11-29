import * as type from './mutation-types'
import Vue from 'vue'
const mutations = {
  openBle (state) {
    state.bleAvailable = true
  },
  closeBle (state) {
    state.bleAvailable = false
  },
  updateSwitch (state, device) {
    if (state.switchList[device.deviceId]){
      state.switchList[device.deviceId] = device
      console.log('正在更新开关状态1', device, state.switchList)
    } else {
      Vue.set(state.switchList, device.deviceId, device)
      console.log('正在更新开关状态2', device, state.switchList)
    }
  },
  updateConnectedSwitch (state, device) {
    if (state.switchList[device.deviceId]){
      state.switchList[device.deviceId] = device
      console.log('正在更新开关状态111', device, state.switchList)
    } else {
      Vue.set(state.switchList, device.deviceId, device)
      mutations.updateLocalSwitch(state, device)
      console.log('正在更新开关状态222', device, state.switchList)
    }
  },
  connSwitch (state, device) {
    state.curSwitchId = device.deviceId
    console.log('已连接id',state.curSwitchId)
    mutations.updateLocalSwitch(state, state.switchList[device.deviceId])
  },
  disconSwitch (state, deviceId) {
    if (state.switchList[deviceId]) {
      state.switchList[deviceId].status = 3
      if(deviceId === state.curSwitchId) state.curSwitchId = null
    }
  },
  // delete
  deleteSwitch (state, deviceId) {
    if (state.switchList[deviceId]) {
      Vue.delete(state.switchList, deviceId)
      if(deviceId === state.curSwitchId) state.curSwitchId = null
      mutations.deleteLocalSwitch(state, deviceId)
    }
  },
  changeSwitchName (state, {deviceId, localName}) {
    if (state.switchList[deviceId]) {
      state.switchList[deviceId].localName = localName
    }
    mutations.updateLocalSwitch(state, state.switchList[deviceId])
  },
  changeLightName (state, {deviceId, lightIndex, value }) {
    if (!state.switchList[deviceId]) {
      wx.showToast({
        title: '不存在的开关'
      })
      return
    }
    let device = state.switchList[deviceId]
    device.lightList[lightIndex].name = value
    mutations.updateLocalSwitch(state, device)
  },
  updateLocalSwitch (state, device) {
    let dev = JSON.parse(JSON.stringify(device)) 
    console.log('当前存储的设备', device)
    dev.status = 3
    if(state.switchListLocal[dev.deviceId]){
      state.switchListLocal[dev.deviceId] = dev
      console.log('已在缓存中更新',state.switchListLocal)
    } else {
      Vue.set(state.switchListLocal, dev.deviceId, dev)
      console.log('已添加到历史中',state.switchListLocal)
    }
  },
  deleteLocalSwitch (state, deviceId) {
    if (state.switchListLocal[deviceId]) {
      Vue.delete(state.switchListLocal, deviceId)
    }
  },
  getHisDevice (state) {
    state.switchList = JSON.parse(JSON.stringify(state.switchListLocal))
  },
  // 二进制获取状态
  changeLightState (state, {deviceId, value}) {
    if (!state.switchList[deviceId]) {
      wx.showToast({
        title: '不存在的开关'
      })
      return
    }
    var device = state.switchList[deviceId]
    var dataView = new DataView(value)
    var lightsArr = device.lightList
    var lightState = dataView.getUint8(0)
    var optionState = dataView.getUint8(1)
    var hardwareVer = dataView.getUint8(2)
    var softwareVer = dataView.getUint8(3)
    var data = []
    data[0] = dataView.getUint8(1)
    // 获取灯数量
    if ((lightState & 0xC0) >> 6 === 0) {
      lightsArr[0].visible = true
      lightsArr[1].visible = false
      lightsArr[2].visible = false
      lightsArr[3].visible = false
    } else if ((lightState & 0xC0) >> 6 === 1) {
      lightsArr[0].visible = true
      lightsArr[1].visible = true
      lightsArr[2].visible = false
      lightsArr[3].visible = false
    } else if ((lightState & 0xC0) >> 6 === 2) {
      lightsArr[0].visible = true
      lightsArr[1].visible = true
      lightsArr[2].visible = true
      lightsArr[3].visible = false
    } else if ((lightState & 0xC0) >> 6 === 3) {
      lightsArr[0].visible = true
      lightsArr[1].visible = true
      lightsArr[2].visible = true
      lightsArr[3].visible = true
    }
    // console.log('8-15位',dataView.getUint8(1))
    // 获取灯连接状态
    ;(lightState & 0x01) === 1 ? lightsArr[0].status = 0 : lightsArr[0].status = 1
    ;(lightState & 0x02) >> 1 === 1 ? lightsArr[1].status = 0 : lightsArr[1].status = 1
    ;(lightState & 0x04) >> 2 === 1 ? lightsArr[2].status = 0 : lightsArr[2].status = 1
    ;(lightState & 0x08) >> 3 === 1 ? lightsArr[3].status = 0 : lightsArr[3].status = 1

    // 获取信号增强开关，0为开启
    var signalStrong = (optionState & 0x08) >> 3
    device.signalStrong = signalStrong

    // 获取静音模式  1为开启
    var mute = (optionState & 0x04) >> 2
    device.mute = mute

    // 亮背光  0为开启
    var backlightStrong = (optionState & 0x02) >> 1
    device.backlightStrong = backlightStrong

    // 暗背光  0为开启
    var backlightWeak = optionState & 0x01
    device.backlightWeak = backlightWeak
    // 版本号
    var version = hardwareVer.toString() + '.' + softwareVer.toString()
    device.version = version
    console.log('changeLightState', this)
    mutations.updateConnectedSwitch(state, device)
    // mutations.updateSwitch(state, device)
    state.curSwitchId = device.deviceId
  }
}

export default mutations
