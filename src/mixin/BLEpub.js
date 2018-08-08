import BLE from '@/utils/BLEservice'
import store from '@/store'
import Comm from '@/utils/common.js'
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
    disConnAll (switchList) {
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
      let dId = deviceId
      let sId = Comm.SampleGattAttributes.SIMPLEIO_SERVICE
      let cId = Comm.SampleGattAttributes.SIMPLEIO_CHAR2_CHARACTERISTIC
      BLE.readBLECharacteristicValue(dId, sId, cId)
    }
  }
}
