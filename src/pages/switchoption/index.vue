<template>
	<div class="page">
    <input type="file" class="upload-input" accept="image/*">
		<div class="page__bd">
			<div class="weui-cells weui-cells_after-title">
	            <div class="weui-cell weui-cell_input">
	                <div class="weui-cell__hd">
	                    <div class="weui-label">模块名称</div>
	                </div>
	                <div class="weui-cell__bd">
	                    <input class="weui-input" bindinput="changeSwitchName" v-model="switchCopy.localName"  />
	                </div>
	            </div>
	            <div class="weui-cell weui-cell_input">
	                <div class="weui-cell__hd">
	                    <div class="weui-label">连接密码</div>
	                </div>
	                <div class="weui-cell__bd">
	                    <input class="weui-input" bindinput="changePwd"  v-model="switchCopy.pwd"/>
	                </div>
	            </div>
	            <div class="weui-cell weui-cell_input weui-cell_vcode">
	                <div class="weui-cell__hd">
	                    <div class="weui-label">固件版本</div>
	                </div>
	                <div class="weui-cell__bd">
	                    {{switchCopy.version}}
	                </div>
	                <div class="weui-cell__ft">
	                    <div class="weui-vcode-btn noborder" @tap="updateFirmware">
	                    	<!-- <button class="weui-btn" type="default" plain="true">按钮</button> -->
	                    	更新固件
	                    </div>
	                </div>
	            </div>
	        </div>
	        <div class="weui-cells__title">选项</div>
        	<div class="weui-cells weui-cells_after-title"> 
	            <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
	                <div class="weui-cell__bd">静音</div>
	                <div class="weui-cell__ft">
	                    <switch  :checked="!!switchCopy.mute"  bindchange="changeMuteState"/>
	                </div>
	            </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">强背光</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!switchCopy.backlightStrong"  bindchange="changeBacklightStrongState"/>
                  </div>
              </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">弱背光</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!switchCopy.backlightWeak"  bindchange="changeBacklightWeakState"/>
                  </div>
              </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">信号增强</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!!switchCopy.signalStrong"  bindchange="changeSignalState"/>
                  </div>
              </div>
	        </div>

        	<div class="weui-cells__title">列表</div>
        	<div class="weui-cells weui-cells_after-title">    
	            <div class="weui-cell weui-cell_input"  v-for="(light, index) in switchCopy.lightList" :key="light.deviceId">
	                <div class="weui-cell__hd">
	                    <div class="weui-label">灯{{index + 1}}</div>
	                </div>
	                <div class="weui-cell__bd">
	                    <input class="weui-input" bindinput="changeLightName"  v-model="light.name"/>
	                </div>
	            </div>
	        </div>
		</div>
		<div class="page__bd page__bd_spacing mtop15">
			<button class="weui-btn mbottom50" type="default" @tap="saveChange">保存</button>
      <br/>
      <br/>
      <br/>
      <br/>
		</div>
	</div> 
</template>

<script>
import BLEpub from '@/mixin/BLEpub.js'
import BLE from '@/utils/BLEservice'
import Comm from '@/utils/common.js'
import Config from '@/utils/Config.js'

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
      switchCopy:state => {
        console.log(JSON.stringify(state.switchList[this.deviceId]))
        return JSON.parse(JSON.stringify(state.switchList[this.deviceId]))
        // return state.switchList[this.deviceId]
      }
    })
  },
  mixins: [BLEpub],
  methods: {
    // 初始化参数
    getSwitchOption (options) {
      wx.showLoading({
        title:"正在连接",
        mask:true
      })
      this.updatSwitchState(this.deviceId)
    },
    // 设置参数
    setDeviceOption (value) {
      var self = this,
          dId = self.device.deviceId,
          sId = self.$parent.globalData.UUID.SIMPLEIO_SERVICE,
          cId = self.$parent.globalData.UUID.SIMPLEIO_CHAR1_CHARACTERISTIC

        var val = new ArrayBuffer(1),
            dataView = new DataView(val)
            dataView.setUint8(0,value)
        self.$parent.globalData.currentDevice = self.device
        return new Promise(function(resolve,reject){
          self.writeBLECharacteristicValue(dId,sId,cId,val)
          .then(function(res){
            console.log("设置设置成功")
            var readcId = self.$parent.globalData.UUID.SIMPLEIO_CHAR2_CHARACTERISTIC
            return  self.readBLECharacteristicValue(self.device,sId,readcId)
          }).then(function(res){
            resolve(res)
          }).catch(function(err){
            reject(err)
            wx.hideLoading()
          })
        })    
    },

    // 保存\设置非记录在设备的参数
    saveChange () {
      
      var self = this
      if(self.showEmptyWarnning()) return
      if(!self.isStringValidate()) return

      wx.showLoading({
        title:'正在保存',
        mask:true
      })
      setTimeout(function(){
        wx.hideLoading()
      },10000)
      self.pointer.localName = self.device.localName
      //self.pointer.pwd = self.device.pwd
      for (var i = self.pointer.lightList.length - 1; i >= 0; i--) {
        self.pointer.lightList[i].name = self.device.lightList[i].name
      }

      // 保存
      self.setPwd()
      .then(function(res){
        return self.setSwitchHis()
      }).then(function(res){  
        self.$apply()
        wx.showToast({
          title:'保存成功',
          icon:"success",
          mask:true,
          duration:500
        })
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        },500)
      }).catch(function(err){
        console.log("保存出错",err)
        wx.hideLoading()
      })
    },

    // 保存密码
    setPwd () {
      // 不存在则不存
      if(!this.switchCopy.pwd || Config.pwdReg.test(this.switchCopy.pwd)){
        return Promise.resolve("no set pwd")
      }
      this.updatSwitchPwd(this.switchCopy.deviceId)
    },

    // 保存字符校验
    isStringValidate () {
      var self = this,
          res = true,
          str,
          pwdReg = /^\d{0,6}$/
      var len = self.getLength(self.device.localName)
      if(len > 16){
        str = "名字不能超过8个中文或16个字母"
        res = false
      }
      else if(self.device.pwd && !pwdReg.test(self.device.pwd)){
        console.log("当前设置的密码为",self.device.pwd)
        str = "密码必须为6位以内的数字"
        res = false
      }
      for(var i = 0,imax = self.device.lightList.length;i < imax;i++){
        if(self.device.lightList[i].name.length > 8){
          str = "名字不能超过8个中文"
          res = false
          break
        }
      }
      if(!res){
        wx.showModal({
            showCancel:false,
            content:str
        })
      }
      return res
    },    
    // 为空则则提示
    showEmptyWarnning () {
      var self = this
      for(var i in self.switchCopy.lightList){
        console.log(i)
        if(!self.isValidate(self.switchCopy.lightList[i].name)){
          wx.showModal({
            showCancel:false,
                  content:"灯名称不能为空"
          })
          return true
        }
      }

      if(!self.isValidate(self.device.name)){
        wx.showModal({
          showCancel:false,
                content:"开关名称不能为空"
        })
        return true
      }
      return false
    }
    
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
    this.getSwitchOption()
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
