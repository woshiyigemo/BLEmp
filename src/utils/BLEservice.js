import Comm from '@/utils/common.js'
import Config from '@/utils/Config.js'
import store from '@/store'
// 微信蓝牙封装，依赖于wx对象

// 停止扫描
const stopScan = function () {
  return new Promise(function (resolve, reject) {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('stop scan success')
        resolve(res)
      },
      fail: function (err) {
        reject({errMsg: '断开蓝牙连接时发生错误', errInfo: err})
      }
    })
  })
}
// 断开蓝牙设备
// 连接历史设备
const connectDevice = function (device) {
  return new Promise(function (resolve, reject) {
    openBluetoothAdapter()
      .then((res) => {
        // self.addCharacteristicValueChangeListener()
        return createBLEConnection(device)
      }).then((res) => {
        return getService(device.deviceId)
      }).then((res) => {
        return getCharacter(device.deviceId, res.services)
      }).then((res) => {
        console.log('连接success', device.deviceId, res)
        store.dispatch('connSwitch',device)
        resolve(res)
      }).catch((err) => {
        reject({errMsg: '连接蓝牙设备发生错误:' + device.deviceId, errInfo: err})
      })
  })
}
// 断开蓝牙设备
const disconDevice = function (deviceId) {
  return new Promise(function(resolve, reject) {
    wx.closeBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        store.dispatch('disconSwitch', deviceId)
        console.log('断开蓝牙设备成功', deviceId)
        resolve(res)
      },
      fail: function (err) {
        console.log('断开蓝牙设备失败', deviceId)
        reject({errMsg: '断开蓝牙连接时发生错误', errInfo: err})
      }
    })
  })
}

// 连接小程序蓝牙适配器
const openBluetoothAdapter = function() {
  return new Promise(function (resolve, reject) {
    wx.openBluetoothAdapter({
      success: function (res) {
        resolve(res)
      },
      fail: function(err) {
        reject({errMsg: '请确保您的手机开启了蓝牙功能', errInfo: err})
      }
    })
  })
}

// 关闭蓝牙模块
const closeBluetoothAdapter = function () {
  return new Promise(function (resolve, reject) {
    wx.getBluetoothAdapterState({
      success: function (res) {
        if (res.available) {
          wx.closeBluetoothAdapter({
            success: function (res) {
              resolve(res)
            },
            fail: function (err) {
              reject({errMsg: '关闭蓝牙模块失败', errInfo: err})
            }
          })
        } else {
          resolve(res)
        }
      },
      fail: function (err) {
        resolve({errMsg: '关闭蓝牙前获取蓝牙模块状态失败', errInfo: err})
      }
    })
  })
}

// 获取蓝牙适配器状态
const getBluetoothAdapterState = function () {
  return new Promise(function (resolve, reject) {
    wx.getBluetoothAdapterState({
      success: function (res) {
        // 无法开启蓝牙连接
        if (res.available) {
          resolve(res)
        } else if (!res.available) {
          reject({errMsg: '当前设备蓝牙未开启或不可用', errInfo: res})
        }
      },
      fail: function (err) {
        reject({errMsg: '当前设备蓝牙未开启或不可用', errInfo: err})
      }
    })
  })
}

// 开启蓝牙设备搜索,进行设备搜索
const startBluetoothDevicesDiscovery = function () {
  return new Promise(function (resolve, reject) {
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        if (res.isDiscovering) {
          resolve(res)
        } else {
          reject({errMsg: '蓝牙未处于可发现状态', errInfo: res})
        }
      },
      fail: function (err) {
        reject({errMsg: '蓝牙未处于可发现状态',errInfo: err})
      }
    })
  })
}

// 连接蓝牙设备
// 这里的 device 需要已经通过 createBLEConnection 与对应设备建立链接 
const createBLEConnection = function (device) {
  return new Promise(function (resolve, reject) {
    // 尝试连接所有设备
    wx.createBLEConnection({
      deviceId: device.deviceId,
      success: function (res) {
        store.dispatch('updateLocalSwitch',device)
        resolve(res)
      },
      fail: function (res) {
        reject({errMsg: '蓝牙连接失败', errInfo: res})
      }
    })
  })
}

// 获取设备服务
const getService = function (deviceId) {
  return new Promise(function (resolve, reject) {
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject({errMsg: '获取蓝牙设备service错误', errInfo: err})
      }
    })
  })
}

// 获取蓝牙设备特征值
// 需要获取所有服务后才可单独使用对应服务的特征值
// 双平台统一在建立链接后先执行 getBLEDeviceServices 与 getBLEDeviceCharacteristics 后再进行与蓝牙设备的数据交互
const getCharacter = function (deviceId, services) {
  var servicePromisArr = []
  services.forEach(function (item, index, array) {
    servicePromisArr.push(
      new Promise(function (reso, rej) {
        wx.getBLEDeviceCharacteristics({
          deviceId: deviceId,
          serviceId: item.uuid,
          success: function (res) {
            console.log('当前设备的特征值', res)
            // 如果支持notify,则开启notify
            res.characteristics.forEach((o, i) => {
              if (o.properties.notify) {
                wx.notifyBLECharacteristicValueChange({
                  state: true,
                  deviceId: res.deviceId,
                  serviceId: res.serviceId,
                  characteristicId: o.uuid
                })
              }
            })
            reso(res)
          },
          fail: function (err) {
            rej({errMsg: '获取蓝牙设备特征值错误', errInfo: err})
          }
        })
      })
    )
  })
  return Promise.all(servicePromisArr).then(res => {
      Promise.resolve(res)
      console.log('获取蓝牙设备特征值错误成功',res)
    }).catch(err => {
      Promise.reject({errMsg: '获取蓝牙设备特征值错误', errInfo: err})
    })
}

// 读取特征值
const readBLECharacteristicValue = function (dId, sId, cId) {
  return new Promise(function (resolve, reject) {
    wx.readBLECharacteristicValue({
      deviceId: dId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: sId,
      characteristicId: cId,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject({errMsg: '读取特征值失败', errInfo: err})
      }
    })
  })
}

// 写入特征值
const writeBLECharacteristicValue = function (dId, sId, cId, val) {
  return new Promise(function (resolve, reject) {
    wx.writeBLECharacteristicValue({
      deviceId: dId,
      serviceId: sId,
      characteristicId: cId,
      value: val,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject({errMsg: '写入特征值失败', errInfo: err})
      }
    })
  })
}

// 添加特征值变化监听
const addCharacteristicValueChangeListener = function() {
  wx.onBLECharacteristicValueChange(res => {
    // 灯设置
    if (res.characteristicId === Config.SampleGattAttributes.SIMPLEIO_CHAR1_CHARACTERISTIC) {
      console.log("当前设置状态",res)
      store.dispatch('changeStatePwd',{ deviceId: res.deviceId, value: res.value})
    }
    // 灯状态
    else if(res.characteristicId === Config.SampleGattAttributes.SIMPLEIO_CHAR2_CHARACTERISTIC) {
      console.log("当前为读取状态",res)
      store.dispatch('changeLightState', { deviceId: res.deviceId, value: res.value })
    }
    // OAD服务
    else if(res.characteristicId === Config.SampleGattAttributes.OAD_IMAGE_NOTIFY_CHAR) {
      console.log("当前为OAD服务",res)
    }
    console.log("当前为未匹配到任何服务",res)
  })
}

const foundDevice = function () {
  
  wx.onBluetoothDeviceFound(res => {
    var dev = res.devices[0]
    // console.log('发现设备', dev)
    if (dev.name.toUpperCase() !== 'LOLAR_SWITCH') return
    // 如果未在历史记录中,则加入
    console.log('触发', dev)
    if (!store.getters.getLocalSwitchById(res.devices[0].deviceId)) {
      console.log('s222')
      dev = Comm.createSwitch(dev)
      store.dispatch('updateSwitch', dev)
    } 
    // 如果已在历史列表中则标为未连接
    else {
      console.log('s111')
      dev = store.getters.getLocalSwitchById(res.devices[0].deviceId)
      dev.status = 1
      store.dispatch('updateSwitch', dev)
    } 
  })
  console.log('触发1111')
}

export default {
  openBluetoothAdapter,
  getBluetoothAdapterState,
  startBluetoothDevicesDiscovery,
  createBLEConnection,
  getService,
  getCharacter,
  closeBluetoothAdapter,
  connectDevice,
  disconDevice,
  readBLECharacteristicValue,
  writeBLECharacteristicValue,
  addCharacteristicValueChangeListener,
  foundDevice,
  stopScan
}
