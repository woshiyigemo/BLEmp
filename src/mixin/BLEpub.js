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
      
      // var promiseArr = []
      // switchList.forEach(function (o, i) {
      //   if (o.status === 0) {
      //     var a = BLE.disconDevice(o)
      //     promiseArr.push(a)
      //   }
      // })
      var promiseArr = []
      // for(var i in switchList)
      return new Promise(function (resolve, reject) {
        // Promise.all(promiseArr)
        //   .then((res) => {
        //     return BLE.closeBluetoothAdapter()
        //   })
        //   .then((res) => {
        //     console.log('全部已断开')
        //     resolve(res)
        //   }).catch((err) => {
        //     console.log('全部断开错误', err)
            // resolve(err)
          // })
          resolve('success')
      })
    },
    // 扫描设备
    scanDeviceManual () {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          BLE.stopScan()
            .then(res => {
              return BLE.closeBluetoothAdapter()
            })
            .then(res => {
              resolve('end')
              wx.hideLoading()
            }).catch(err => {
              resolve('end')
              console.log('停止扫描出错', err)
              wx.hideLoading()
            })
        }, 6000)

        BLE.openBluetoothAdapter()
          .then(res => {
            console.log(11)
            return BLE.getBluetoothAdapterState()
          }).then(res =>{
            console.log(22)
            BLE.addCharacteristicValueChangeListener()
            return BLE.startBluetoothDevicesDiscovery()
          }).then(function (res) {
            console.log(33)
            BLE.foundDevice()
            resolve(res)
          }).catch(function (err) {
            reject(err)
          })
      })
    }
  }
}
