import * as type from './mutation-types';
const mutations = {
  // [type.SET_MPVUEINFO](state, mpvueInfo) { // eslint-disable-line
  //   state.mpvueInfo = mpvueInfo;
  // },
  // add switch
  addSwitch (state, device) {
    state.switchList.push(device)
  },
  // delete
  deleteSwitch (state, device) {
    for (var i = state.switchList.length - 1; i >= 0; i++) {
      if (state.switchList[i].deviceId === device.deviceId) {
        state.switchList.splice(i, 1)
      }
    }
  },
  // change state 该方法只能修改status/localName/name
  changeSwitchState (state, device) {
    for (var i = state.switchList.length - 1; i >= 0; i++) {
      if (state.switchList[i].deviceId === device.deviceId) {
        state.switchList[i].status = device.status
        state.switchList[i].localName = device.localName
        state.switchList[i].name = device.name
        break
      }
    }
  },
  // change light
  changeLightState (state, device, value) {
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
    device.version  = version
    console.log('查看device设备', device, device.lightList)

    // 更新状态
    for (var i = state.switchList.length - 1; i >= 0; i++) {
      if (state.switchList[i].deviceId === device.deviceId) {
        state.switchList[i] = device
        break
      }
    }
  }
}

export default mutations
