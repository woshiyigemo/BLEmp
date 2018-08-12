import BLE from '@/utils/BLEservice'
import store from '@/store'
import Comm from '@/utils/common.js'
import Config from '@/utils/Config.js'
export default {
  data () {
    return {
      name: 'mixin'
    }
  },
  created () {
    console.log('mixin...', this.name);
  },
  mounted () {},
  methods: {
    // 断开所有
    disConnAll () {
      var sList = store.getters.switchArr
      var promiseArr = []
      sList.forEach(function (o, i) {
        if (o.status === 0) {
          var a = BLE.disconDevice(o)
          promiseArr.push(a)
        }
      })
      return new Promise(function (resolve, reject) {
        Promise.all(promiseArr)
          .then((res) => {
            return BLE.closeBluetoothAdapter()
          })
          .then((res) => {
            console.log('全部已断开')
            resolve(res)
          }).catch((err) => {
            console.log('全部断开错误', err)
            resolve(err)
          })
      })
    },
    // 扫描设备
    scanDeviceManual () {
      return new Promise(function (resolve, reject) { 
        setTimeout(() => {
          BLE.stopScan()
            // .then(res => {
            //   return BLE.closeBluetoothAdapter()
            // })
            .then(res => {
              resolve('end')
            }).catch(err => {
              resolve('end')
              console.log('停止扫描出错', err)
            })
        }, 6000)
        
        BLE.openBluetoothAdapter()
          .then(res => {
            return BLE.getBluetoothAdapterState()
          }).then(res =>{
            BLE.addCharacteristicValueChangeListener()
            return BLE.startBluetoothDevicesDiscovery()
          }).then(function (res) {
            BLE.foundDevice()
          }).catch(function (err) {
            wx.showToast({
              title: err.errMsg
            })
            reject(err)
          })
      })
    },
    // 更新
    updatSwitchState (deviceId) {
      if (!deviceId || !store.getters.getSwitchById(deviceId)) return
      console.log(1212, store.getters.getSwitchById(deviceId))
      let dId = deviceId
      let sId = Config.SampleGattAttributes.SIMPLEIO_SERVICE
      let cId = Config.SampleGattAttributes.SIMPLEIO_CHAR2_CHARACTERISTIC
      BLE.readBLECharacteristicValue(dId, sId, cId)
        .then(res => {
          console.log('22222', res)
        }).catch(err => {
          console.log('333333', err)
        })
    },
    // 密码更新
    updatSwitchPwd (deviceId, pwd) {
      if (!deviceId || !this.store.getters.getSwitchById(deviceId)) return
      let abPwd = new ArrayBuffer(4)
      let dataView = new DataView(abPwd)
      dataView.setUint32(0, parseInt(pwd))
      let dId = deviceId
      let sId = Config.SampleGattAttributes.SIMPLEIO_SERVICE
      let cId = Config.SampleGattAttributes.SIMPLEIO_CHAR2_CHARACTERISTIC
      return new Promise((resolve, reject) => {
        BLE.writeBLECharacteristicValue(dId, sId, cId, abPwd)
          .then(res => {
            console.log('修改密码成功')
            resolve(res)
          }).catch(err => {
            console.log('修改密码失败')
            reject(err)
          })
      })
    }
  }
}
