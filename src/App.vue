<script>
import BLE from '@/utils/BLEservice.js'
import BLEpub from '@/mixin/BLEpub.js'
import store from '@/store'

export default {
  data(){
    return {
      timmer:null,
      isReloading: false // 自动刷新
    }
  },
  mixins:[BLEpub],
  created () {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // console.log('app created and cache logs by setStorageSync')
    store.dispatch('getHisDevice')
  },
  mounted () {
    // store.dispatch('getHisDevice')
  },
  methods: {
    _connectionSwitchAuto(){
      let mySwitch = store.getters.getCurSwitch()
      if(!mySwitch) return
      this.isReloading = true
      wx.showLoading({
        mask:true,
        title:'正在重新连接'
      })
      this.updatSwitchState(mySwitch.deviceId)
      .then(()=>{

      }).catch(()=>{
        wx.showLoading({
          title:"正在重新连接",
          mask:true
        })
        return BLE.connectDevice(mySwitch)
      }).then((res) => {
        self.switchItem.status = 0
        return this.updatSwitchState(mySwitch.deviceId)
      }).then((res) => {
        console.log('自动重连成功',mySwitch)
        wx.hideLoading()
      }).catch((err) => {
        console.log('重连尝试失败，断开并返回')
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      })
    }
  },
  onShow(e){
    let self = this
    this.timmer = setInterval(()=>{
      let dev = store.getters.getCurSwitch()
      if(dev) self.updatSwitchState(dev.deviceId)
      console.log('定时任务开启',dev)
    }, 1000)
    console.log('APP SHOW ',e)
    // 检测并打开蓝牙模块
    BLE.getBluetoothAdapterState()
      .then(res => {

      }).catch( err => {
        console.log('获取蓝牙模块状态', err)
        // 针对ios下openBluetoothAdapter
        let res = wx.getSystemInfoSync()
        console.log(res)

        if (!err.errInfo.available) {
          wx.showToast({
            title:'请确保手机开启了蓝牙',
            icon: 'none',
            duration:1000
          })
          return
        }
        BLE.openBluetoothAdapter()
      })
    BLE.addCharacteristicValueChangeListener()
    // console.log( getCurrentPages())

  },
  onHide(e){
    if(this.timmer) {
      clearInterval(this.timmer)
      // console.log(this.timmer)
    }
    console.log('APP HIDE ')
    // 关闭蓝牙模块
    BLE.getBluetoothAdapterState()
      .then(res => {
        console.log('断开对象', e)
        return this.disConnAll()
      }).catch(err => {
        console.log('断开失败', err)
      })
    console.log(getCurrentPages())
    if(getCurrentPages()[0]){
      wx.redirectTo({
        url:'../switchlist/main'
      })
    }
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
