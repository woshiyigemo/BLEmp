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
        resolve(res)
      }).catch((err) => {
        reject({errMsg: '连接蓝牙设备发生错误:' + device.deviceId, errInfo: err})
      })
  })
}
// 断开蓝牙设备
const disconDevice = function (device) {
  return new Promise(function(resolve, reject) {
    wx.closeBLEConnection({
      deviceId: device.deviceId,
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
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
        reject({errMsg: '请确保开启了蓝牙功能', errInfo: err})
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
  return new Promise(function (resolve, reject) {
    var servicePromisArr = []
    services.forEach(function (item, index, array) {
      servicePromisArr.push(
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
            resolve(res)
          },
          fail: function (err) {
            reject({errMsg: '获取蓝牙设备特征值错误', errInfo: err})
          }
        })
      )
    })
    Promise.all(servicePromisArr)
      .then(res => {
        resolve(res)
      }).catch(err => {
        reject({errMsg: '获取蓝牙设备特征值错误', errInfo: err})
      })
  })
}

// 读取特征值
const readBLECharacteristicValue = function (device, sId, cId) {
  return new Promise(function (resolve, reject) {
    wx.readBLECharacteristicValue({
      deviceId: device.deviceId,
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
  stopScan
}
