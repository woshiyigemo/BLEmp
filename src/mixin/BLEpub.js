import BLE from '@/utils/BLEservice'
import store from '@/store'
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
            reject(err)
          })
      })
    }
  }
}
