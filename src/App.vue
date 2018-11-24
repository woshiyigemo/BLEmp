<script>
import BLE from '@/utils/BLEservice.js'
import store from '@/store'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
    store.dispatch('getHisDevice')
  },
  onShow(e){
    console.log('APP SHOW ',e)
    
    BLE.getBluetoothAdapterState()
      .then(res => {
        
      }).catch( err => {
        console.log('获取蓝牙模块状态', err)
        // 针对ios下
        let res = wx.getSystemInfoSync()
        console.log(res)

        if (!err.errInfo.available) {
          wx.showToast({
            title:'请确保手机开启了蓝牙',
            icon: 'none',
          })
          return
        }
        BLE.openBluetoothAdapter()
      })
    BLE.addCharacteristicValueChangeListener()
  },
  onHide(){
    console.log('APP HIDE ')
    BLE.getBluetoothAdapterState()
      .then(res => {
        return BLE.closeBluetoothAdapter()
      })
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
