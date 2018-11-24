<template>
  <div class="switch-line">
    <div class="switch-add"  @tap="_connectionSwitch" @longpress="_deleteDevice">  
      <div class="colorbar" :style="switchColor"></div>
      <!-- <div class="colorbar" style="background-color:#ff0000;"></div> -->
      <div class="switch-name">{{switchItem.localName}}</div>
      <div class="switch-status">{{switchStatus}}</div>
    </div>
    <div class="switch-button">
      <image  style="width:24px;height:24px;" src="../images/@3x/info@3x.png"/>
    </div>
  </div>
</template>
<script>
  import Comm from '@/utils/common' 
  import Config from '@/utils/Config.js' 
  import BLE from '@/utils/BLEservice'
  import store from '@/store'
  import BLEpub from '@/mixin/BLEpub.js'
  export default {
    props:{
      // 灯对象
      switchItem: {
        type:Object,
        default: {
          deviceId:'0000-0000',
          localName:'',
          status:3
        }
      }
    },

    data(){
      return {

      }
    },
    mixins:[BLEpub],
    computed:{
      switchColor: function () {
        return  'background-color:' + Config.statusColor[this.switchItem.status] + ';'
      },
      switchStatus: function () {
        return  Config.statusText[this.switchItem.status]
      }
    },
    methods:{
      // 删除开关 
      _deleteDevice(e){
        wx.showModal({
          content:"确定要删除" + this.switchItem.localName + "吗？",
          success:(res) => {
            // 删除对应的开关并重新读取
            if(res.confirm){
              wx.showLoading({
                title:"正在删除设备" + this.switchItem.localName,
                mask:true
              })
              // 连接状态需要先断开连接
              if(this.switchItem.status == 0){
                BLE.getBluetoothAdapterState()
                // 若蓝牙可用则先删除
                .then((res) => {
                  return BLE.disconDevice(this.switchItem.deviceId)
                }).then((res) => {
                  console.log('删除设备成功0', res)
                  // 删除开关
                  this.$emit('deleteSwitch',this.switchItem)
                  wx.hideLoading()
                }).catch((err) => {  
                  wx.hideLoading()
                })
              } else {

                // 删除开关
                this.$store.dispatch('deleteSwitch')
                console.log('删除设备成功1')
                this.$emit('deleteSwitch',this.switchItem)
                wx.hideLoading()
              }
            }
          }
        })
      },
      // 设备连接
      _connectionSwitch(e){
        var self = this
        // 连接状态直接跳转 
        if(this.switchItem.status == 0){
          this.updatSwitchState(this.switchItem.deviceId)
          .then((res) => {
            this.$emit('afterConnectedSwitch',this.switchItem)
          }).catch((err) => {

          })
          this.$emit('afterConnectedSwitch',this.switchItem)
        }
        // 未连接或新设备进行连接
        else if(this.switchItem.status == 1 || 
                this.switchItem.status == 2 ||
                this.switchItem.status == 3){
          wx.showLoading({
            title:"正在连接",
            mask:true
          })
          BLE.connectDevice(self.switchItem)
          .then((res) => {
            self.switchItem.status = 0
            return this.updatSwitchState(this.switchItem.deviceId)
          }).then((res) => {
            this.$emit('afterConnectedSwitch',this.switchItem)
            console.log('点击链接设备成功',this.switchItem)
            wx.hideLoading()
          }).catch((err) => {
            console.log(9090)
            wx.hideLoading()
          })
        }
        // 离线状态直接返回
        else {
          wx.showModal({
            content:'未扫描到该设备',
            showCancel:false
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
.switch-line{
  border-radius:4px;
  position:relative;
  box-shadow: 0 0 3px #bebebe; 
  overflow:hidden;
  height:28px;
  padding:5px 5px 5px 12px;
  margin-bottom:12px;
  display:flex;
}
.switch-line:active{
  background-color:#dedcdc;
}
.switch-line .switch-add{
  display:flex;
  flex:1;
}

.switch-line .colorbar{
  width:5px;
  /*background-color:#880000;*/
  position:absolute;
  top:0;
  bottom:0;
  left:0; 
  border-top-left-radius:3px;
  border-bottom-left-radius:3px;
}
.switch-line .switch-name{
  padding-right:50px;
  font-size:16px;
  color:#444;
  height:28px;
  line-height:28px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
  flex:1;
}

.switch-line .switch-status{
  padding-right:38px;
  font-size:14px;
  color:#999;
  height:28px;
  line-height:28px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
.switch-line .switch-button{
  height:24px;
  width:24px;
  border-radius:999px;
  position:absolute;
  right:0;
  top:0;
  margin:7px;
}
</style>