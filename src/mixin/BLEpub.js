import BLE from '@/utils/BLEservice'
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
      var promiseArr = []
      switchList.forEach(function (o, i) {
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
    }
    
  }
}
