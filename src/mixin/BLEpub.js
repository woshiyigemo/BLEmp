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
    // params
    disConnAll () {
      var sList = store.getters.switchListArr
      var promiseArr = []
      sList.forEach(function (o, i) {
        if (o.status === 0) {
          var a = BLE.disconDevice(o.deviceId)
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
              resolve(res)
            }).catch(err => {
              resolve(err)
              console.log('停止扫描出错', err)
            })
        }, 6000)
        
        BLE.openBluetoothAdapter()
          .then(res => {
            return BLE.getBluetoothAdapterState()
          }).then(res =>{
            console.log(223)
            BLE.addCharacteristicValueChangeListener()
            return BLE.startBluetoothDevicesDiscovery()
          }).then(function (res) {
            console.log(333)
            BLE.foundDevice()
            // resolve(res)
          }).catch(function (err) {
            console.log(443,err)
            reject(err)
          }) 
      })
    },

    // 更新
    updatSwitchState (deviceId) {
      if (!deviceId || !store.getters.getSwitchById(deviceId)) return
      let dId = deviceId
      let sId = Config.SampleGattAttributes.SIMPLEIO_SERVICE
      let cId = Config.SampleGattAttributes.SIMPLEIO_CHAR2_CHARACTERISTIC
      return new Promise((resolve, reject) => {
        BLE.readBLECharacteristicValue(dId, sId, cId)
        .then(res => {
          console.log('更新开关状态成功',res)
          resolve(res)
        }).catch(err => {
          console.log('更新开关状态失败', err)
          reject(err)
        })
      })
    },
    // 密码更新
    updatSwitchPwd (deviceId, pwd) {
      if (!deviceId || !store.getters.getSwitchById(deviceId)) return
      let abPwd = new ArrayBuffer(4)
      let dataView = new DataView(abPwd)
      dataView.setUint32(0, parseInt(pwd))
      let dId = deviceId
      let sId = Config.SampleGattAttributes.SIMPLEIO_SERVICE
      let cId = Config.SampleGattAttributes.SIMPLEIO_CHAR5_CHARACTERISTIC
      return new Promise((resolve, reject) => {
        BLE.writeBLECharacteristicValue(dId, sId, cId, abPwd)
          .then(res => {
            console.log('修改密码成功')
            resolve(res)
          }).catch(err => {
            console.log('修改密码失败',err)
            reject(err)
          })
      })
    }
  }
}
