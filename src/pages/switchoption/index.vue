<template>
	<div class="page">
    <!-- <input type="file" class="upload-input" accept="image/*"> -->
		<div class="page__bd">
            <div class="weui-cells" >
            <a class="weui-cell weui-cell_access"  >
                <div class="weui-cell__bd" data-optionkey="localName" data-optionval="{{switchCopy.localName||''}}" @tap="navTo">
                    <p>设备名称</p>
                </div>
                <div class="weui-cell__ft" v-html="switchCopy.localName||''"></div>
            </a>
            <a class="weui-cell weui-cell_access" data-optionkey="pwd" data-optionval="{{switchCopy.pwd||''}}" @tap="navTo" >
                <div class="weui-cell__bd">
                    <p>连接密码</p>
                </div>
                <div class="weui-cell__ft" v-html="switchCopy.pwd||''"></div>
            </a>
            <div class="weui-cell weui-cell_access" >
                <div class="weui-cell__bd">
                    <p>固件版本</p>
                </div>
                <div class="weui-cell__ft" v-html="switchCopy.version||''"></div>
            </div>
            <!-- <a class="weui-cell weui-cell_access" >
                <div class="weui-cell__bd">
                    <p>固件版本</p>
                </div>
                <div class="weui-cell__ft" v-html="switchCopy.version||''"></div>
            </a> -->
            </div>





	        <div class="weui-cells__title">选项</div>
        	<div class="weui-cells weui-cells_after-title"> 
	            <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
	                <div class="weui-cell__bd">静音</div>
	                <div class="weui-cell__ft">
	                    <switch  :checked="!!switchCopy.mute"  @change="changeMuteState"/>
	                </div>
	            </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">强背光</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!switchCopy.backlightStrong"  @change="changeBacklightStrongState"/>
                  </div>
              </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">弱背光</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!switchCopy.backlightWeak"  @change="changeBacklightWeakState"/>
                  </div>
              </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">信号增强</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!!switchCopy.signalStrong"  @change="changeSignalState"/>
                  </div>
              </div>
	        </div>

        	<div class="weui-cells__title">列表</div>
          <div class="weui-cells">
            <a class="weui-cell weui-cell_access" data-optionkey="lightName" data-optionval="{{index}}" @tap="navTo" v-for="(light, index) in switchCopy.lightList" :key="light.deviceId">
                <div class="weui-cell__bd">
                    <p>灯{{index + 1}}</p>
                </div>
                <div class="weui-cell__ft" v-html="light.name"></div>
            </a>
          </div>
		</div>
    <br>
    <br>
    <br>
    
    <div class="weui-btn-area">
        <button class="weui-btn mbottom50" type="default" @tap="taptest">保存</button>
    </div>
	</div> 
</template>

<script>
import BLEpub from '@/mixin/BLEpub.js'
import BLE from '@/utils/BLEservice'
import Comm from '@/utils/common.js'
import Config from '@/utils/Config.js'
import qs from 'qs'
import { mapState, mapGetters} from 'vuex'
export default  {

  data: function(){
    return {
      framewareUrl:'http://x.hao61.net/bluetemp/LOLAR-SW-180317.bin',
      frameTempUrl:'',
      optionsReady:false,
      pointer:null, // 开关指针
      device:null,
      deviceOption: {
        version: '0.0.0', // 版本
        mute: 0,          // 静音
        backlightStrong: false, // 强背光
        backlightWeak: true,    // 弱背光
        signalStrong: false     // 信号增强
      }
    }
  },
  computed: {
    ...mapState({
      switchCopy(state) {
        // console.log(999999,this,this.deviceId,JSON.stringify(state.switchList[this.deviceId]))
        if(!state.switchList[this.deviceId]) {
          wx.showToast({
            title:'未获取到正确的设备',
            icon:"none",
            mask:true,
            duration:800,
            complete:(rs) => {
              wx.navigateBack({
                delta: 1
              })
            },
          })
          return 
        }
        return JSON.parse(JSON.stringify(state.switchList[this.deviceId]))
      }
    })
  },
  mixins: [BLEpub],
  methods: {
    // 初始化参数
    // getSwitchOption (options) {
    //   wx.showLoading({
    //     title:"正在连接",
    //     mask:true
    //   })
    //   this.updatSwitchState(this.deviceId)
    //     .then(res => {
    //        wx.hideLoading()
    //     }).catch(err => {
          
    //     })
    // },
    navTo: (e) => {
        // this.deviceId = decodeURIComponent(query.deviceId)
        // query.lightIndex ? this.options.lightIndex = decodeURIComponent(query.lightIndex) : null
        // this.options.key = decodeURIComponent(query.key)
        // this.options.name = query.lightIndex ? mapInfo[this.options.key](query.lightIndex) : mapInfo[this.options.key]
        // this.options.value = decodeURIComponent(query.val)
        console.log(e)
        var params = {
            deviceId: encodeURIComponent(this.deviceId),
            key: encodeURIComponent(e.target.dataset.optionkey),
            value: encodeURIComponent(e.target.dataset.optionval)
        }
    },
    taptest: function(e) {
      console.log(9999999,e)
    },
    toVersion: () => {
      console.log(8888)
    },
    // // 设置参数
    // setDeviceOption (value) {
    //   var self = this,
    //       dId = self.device.deviceId,
    //       sId = self.$parent.globalData.UUID.SIMPLEIO_SERVICE,
    //       cId = self.$parent.globalData.UUID.SIMPLEIO_CHAR1_CHARACTERISTIC

    //     var val = new ArrayBuffer(1),
    //         dataView = new DataView(val)
    //         dataView.setUint8(0,value)
    //     self.$parent.globalData.currentDevice = self.device
    //     return new Promise(function(resolve,reject){
    //       self.writeBLECharacteristicValue(dId,sId,cId,val)
    //       .then(function(res){
    //         console.log("设置设置成功")
    //         var readcId = self.$parent.globalData.UUID.SIMPLEIO_CHAR2_CHARACTERISTIC
    //         return  self.readBLECharacteristicValue(self.device,sId,readcId)
    //       }).then((res) => {
    //         resolve(res)
    //       }).catch(function(err){
    //         reject(err)
    //         dwx.hideLoading()
    //       })
    //     })    
    // },

    // 保存\设置非记录在设备的参数
    // saveChange () {
    //   var self = this
    //   if(self.showEmptyWarnning()) return
    //   if(!self.isStringValidate()) return

    //   wx.showLoading({
    //     title:'正在保存',
    //     mask:true
    //   })
    //   setTimeout(function(){
    //     wx.hideLoading()
    //   },10000)
    //   self.pointer.localName = self.device.localName
    //   //self.pointer.pwd = self.device.pwd
    //   for (var i = self.pointer.lightList.length - 1; i >= 0; i--) {
    //     self.pointer.lightList[i].name = self.device.lightList[i].name
    //   }

    //   // 保存
    //   self.setPwd()
    //   .then(function(res){
    //     return self.setSwitchHis()
    //   }).then(function(res){  
    //     self.$apply()
    //     wx.showToast({
    //       title:'保存成功',
    //       icon:"success",
    //       mask:true,
    //       duration:500
    //     })
    //     setTimeout(function(){
    //       wx.navigateBack({
    //         delta:1
    //       })
    //     },500)
    //   }).catch(function(err){
    //     console.log("保存出错",err)
    //     wx.hideLoading()
    //   })
    // },



    
  },
  mounted(e){
      console.log('参数', e)
  },
  created(e){
    console.log('参数2', e)
  },
  onLoad(query){
    console.log('查询 dev',query)
    if (!query.deviceId){
      return
    }
    this.deviceId = decodeURIComponent(query.deviceId)
    // this.getSwitchOption()
  }
}
</script>

<style scoped lang="less">
.noborder{
	border:none;
}

.weui-switch:checked,
.weui-switch-cp__input:checked,
.weui-switch-cp__box{
    border-color: #2196F3;
    background-color: #2196F3;
    &:before {
        transform: scale(0);
    }
    &:after {
        transform: translateX(20px);
    }
}
.button-sp-area{
    margin: 0 auto;
    padding-top: 15px;
    width: 60%;
}
.mini-btn{
    margin-right: 5px;
}
.page__bd_spacing{
	padding: 0 15px;
}
.mtop15{
	margin-top:15px;
}
.mbottom50{
  margin-bottom:50px;
}
</style>
