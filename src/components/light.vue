<template>
  <div class="light-line" v-if="light.visible">
    <div class="colorbar" :style="lightColor"></div>
    <div class="light-name">{{light.name}}</div>
    <div class="light-status">{{light.status == 0?"已开启":"已关闭"}}</div>
    <div class="light-button" @tap="_toggleLight">
      <img v-show="light.status === 0" style="width:48px;height:48px;" src="../images/@3x/on@3x.png"/>
      <img v-show="light.status === 1" style="width:48px;height:48px;" src="../images/@3x/off@3x.png"/>
    </div>
  </div>
</template>
<script>
import Comm from '@/utils/common'
import Config from '@/utils/Config.js'
import BLE from '@/utils/BLEservice'

  export default {
    props:{
      // 灯对象
      light: {
        type:Object,
        default: {
          name:'',
          visible:false,
          status:0
        }
      },
      deviceId:{
        type:String,
        default:null
      },
      lightIndex :{
        type:Number,
        default:1
      }
    },
    data(){
      return {
      }
    },
    computed:{
      lightColor:function() {
        console.log('获取灯颜色:',this.light.status, this.lightIndex,Comm.getColorByIndex(this.lightIndex))
        return  'background-color:' + Comm.getColorByIndex(this.lightIndex) + ';'
      }
    },
    methods:{
      // 开关灯
      _toggleLight(e){
        console.log('点击开关',e)
        console.log(this.deviceId,this.lightIndex)
        if(!this.deviceId) return
        var val = new ArrayBuffer(1)
        var dataView = new DataView(val)
        var dId = this.deviceId
        var sId = Config.SampleGattAttributes.SIMPLEIO_SERVICE
        var cId = Config.SampleGattAttributes.SIMPLEIO_CHAR1_CHARACTERISTIC
        dataView.setUint8(0,this.lightIndex + 1)
        BLE.writeBLECharacteristicValue(dId,sId,cId,val)
          .then(res =>{
            this._updateLightState()
          }).catch(err => {})
      },
      // 更新灯状态
      _updateLightState(){
        if(!this.deviceId) return 
        let dId = this.deviceId
        let sId = Config.SampleGattAttributes.SIMPLEIO_SERVICE
        let cId = Config.SampleGattAttributes.SIMPLEIO_CHAR2_CHARACTERISTIC
        console.log('sid', sId,'cid', cId)
        BLE.readBLECharacteristicValue(dId,sId,cId)
          .then(res => {

          }).catch(err => {
            console.log('更新出错',err)
          })
      }
    },
    mounted(){
      console.log(this.light)
    }
  }
</script>

<style scoped lang="less">

.light-line{
  border-radius:4px;
  position:relative;
  box-shadow: 0 0 3px #bebebe; 
  overflow:hidden;
  height:56px;
  padding:5px 5px 5px 12px;
  margin-bottom:12px;
}
.light-line:active{
  background-color:#dedcdc;
}
.light-line .colorbar{
  width:5px;
  /*background-color:#880000;*/
  position:absolute;
  top:0;
  bottom:0;
  left:0; 
  border-top-left-radius:3px;
  border-bottom-left-radius:3px;
}
.light-line .light-name{
  padding-right:50px;
  font-size:16px;
  color:#444;
  height:28px;
  line-height:28px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

.light-line .light-status{
  padding-right:50px;
  font-size:14px;
  color:#999;
  height:28px;
  line-height:28px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
.light-line .light-button{
  height:48px;
  width:48px;
  border-radius:999px;
  position:absolute;
  right:0;
  top:0;
  margin:9px;
}
</style>