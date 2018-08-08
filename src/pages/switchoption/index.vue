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
	                    <input class="weui-input" bindinput="changeSwitchName" v-model="device.localName"  />
	                </div>
	            </div>
	            <div class="weui-cell weui-cell_input">
	                <div class="weui-cell__hd">
	                    <div class="weui-label">连接密码</div>
	                </div>
	                <div class="weui-cell__bd">
	                    <input class="weui-input" bindinput="changePwd"  v-model="deviceOption.pwd"/>
	                </div>
	            </div>
	            <div class="weui-cell weui-cell_input weui-cell_vcode">
	                <div class="weui-cell__hd">
	                    <div class="weui-label">固件版本</div>
	                </div>
	                <div class="weui-cell__bd">
	                    {{deviceOption.version}}
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
	                    <switch  :checked="!!deviceOption.mute"  bindchange="changeMuteState"/>
	                </div>
	            </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">强背光</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!deviceOption.backlightStrong"  bindchange="changeBacklightStrongState"/>
                  </div>
              </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">弱背光</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!deviceOption.backlightWeak"  bindchange="changeBacklightWeakState"/>
                  </div>
              </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">信号增强</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!!deviceOption.signalStrong"  bindchange="changeSignalState"/>
                  </div>
              </div>
	        </div>

        	<div class="weui-cells__title">列表</div>
        	<div class="weui-cells weui-cells_after-title">    
	            <div class="weui-cell weui-cell_input"  v-for="(item, index) in device.lightList" :key="item.deviceId">
	                <div class="weui-cell__hd">
	                    <div class="weui-label">灯{{index + 1}}</div>
	                </div>
	                <div class="weui-cell__bd">
	                    <input class="weui-input" bindinput="changeLightName"  v-model="item.name"/>
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
      switchItem:state => {
        return state.switchList[this.deviceId]
      }
    })
  },
  mixins: [BLEpub],
  methods: {
    // 更改开关名
    changeLightName(e){
      var index = e.currentTarget.dataset.index
      this.device.lightList[index].name = e.detail.value
    },
    // 变动静音选项
    changeMuteState(e){
      var self = this
      console.log("当前静音状态：",e.detail.value)
      var mute = e.detail.value == true?1:0,
          data = 0x05
      self.setDeviceOption(data).then(function(res){
        self.device.mute = mute
        self.$apply()
        console.log("当前静音状态1：",self.device.mute)
      }).catch(function(err){
        // console.log('静音设置错误',err)
      })  	
    },
    // 信号增强选项
    changeSignalState(e){
      var self = this
      console.log("当前信号增强状态：",e)
      var signalStrong = e.detail.value == true?0:1,
          data = 0x08
      self.setDeviceOption(data).then(function(res){
        self.device.signalStrong = signalStrong
        self.$apply()
      }).catch(function(err){
        console.log('信号增强设置错误',err)
      })    
    },
    // 强背光选项
    changeBacklightStrongState(e){
      console.log("当前强背光状态：",e)
      var backlightStrong = e.detail.value == true?0:1,
          data = 0x07
      this.setDeviceOption(data)
      this.device.backlightStrong = backlightStrong
    },
    // 弱背光选项
    changeBacklightWeakState(e){
      console.log("当前弱背光状态：",e)
      var backlightWeak = e.detail.value == true?0:1,
          data = 0x06
      this.setDeviceOption(data)
      this.device.backlightWeak = backlightWeak
    },
    // 更改密码
    changePwd(e){
      this.device.pwd = e.detail.value
    },
    // 更改模块名称
    changeSwitchName(e){
      this.device.localName = e.detail.value
    },
    // 更新固件
    updateFirmware(){
      var self = this
      self.queryVersion()
      console.log('尝试获取版本')
    },
    queryVersion (){
      var self = this
      var dId = self.device.deviceId,
      sId = this.$parent.globalData.UUID.OAD_SERVICE,
      cId = this.$parent.globalData.UUID.OAD_IMAGE_NOTIFY_CHAR
      var val = new ArrayBuffer(1),
          dataView = new DataView(val)
          dataView.setUint8(0,0x00) //  写入0有返回则为镜像A，写入0无返回则为镜像B

      // self.getCharacter()
      // self.addCharacteristicValueChangeListener()
      wx.notifyBLECharacteristicValueChange({
        state: true, 
        deviceId: dId,
        serviceId: sId,
        characteristicId: cId,
        success: function (res) {
          console.log('notifyBLECharacteristicValueChange success', res.errMsg)
        }
      })

      self.writeBLECharacteristicValue(self.device.deviceId,sId,cId,val)
      .then(res => {
        console.log("升级版本查询成功",res)
        // resolve(res)
      }).catch(err => {
        console.log("升级版本查询失败",err)
        // reject(err)
      })
    },
    downloadFrame () {
      var self = this
      return new Promise(function(resolve,reject){
        wx.downloadFile({
          url:self.framewareUrl,
          success:function(res){
            console.log('下载成功',res,res.tempFilePath)
            
            self.frameTempUrl = res.tempFilePath
            resolve(res)
          },
          fail:function(err){
            console.log('下载固件失败',err)
            reject(err)
          }
        })
      })
    },

    isValidate(e){
      console.log(e)
      return e.length > 0
    },
    // 初始化参数
    getSwitchOption (options) {
      wx.showLoading({
        title:"正在连接",
        mask:true
      })
      let dId = device.deviceId
      let sId = this.$parent.globalData.UUID.SIMPLEIO_SERVICE
      let cId = this.$parent.globalData.UUID.SIMPLEIO_CHAR2_CHARACTERISTIC
      
    },

    // 读取设备设置项
    getDeviceOption (device) {
      var self = this
      
    
      self.$parent.globalData.currentDevice = device    
      console.log("这是当前获取的设备",device)
      self.connectDevice(device)
      .then(function(res){
        return self.readBLECharacteristicValue(device,sId,cId)
      })
      .then(function(res){
        console.log("读取设置完毕")
        wx.hideLoading()
      }).catch(function(err){
        console.log("读取设置失败",err)
        wx.hideLoading()
        self.reTryConnect(device)
        .then(function(){
          self.readBLECharacteristicValue(device,sId,cId)
        }).catch(function(){
          self.errHandler(err)
        })
      })
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
      var self = this,
        dId = self.device.deviceId,
        sId = self.$parent.globalData.UUID.SIMPLEIO_SERVICE,
        cId = self.$parent.globalData.UUID.SIMPLEIO_CHAR5_CHARACTERISTIC
      // 不存在则不存

      if(!self.device.pwd){
        return Promise.resolve("no set pwd")
      }

      var pwdReg = /^\d{0,6}$/
      if(!pwdReg.test(self.device.pwd)){
        wx.showModal({
          showCancel:false,
          content:"密码必须为6位以内数字"
        })
        return Promise.reject("pwd invalid")
      }

      var pwd = new ArrayBuffer(4),
          dataView = new DataView(pwd)
      dataView.setUint32(0,parseInt(self.device.pwd))
      self.$parent.globalData.currentDevice = self.device
      return new Promise(function(resolve,reject){
        self.writeBLECharacteristicValue(dId,sId,cId,pwd)
          .then(function(res){
            console.log("设置密码成功")
            var readcId = self.$parent.globalData.UUID.SIMPLEIO_CHAR2_CHARACTERISTIC
            return  self.readBLECharacteristicValue(self.device,sId,readcId)
          }).then(function(res){
            resolve(res)
          }).catch(function(err){
            console.log("设置密码失败",err)
            reject(err)
            wx.hideLoading()
          })
      })    
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
      console.log(self.device)
      for(var i in self.device.lightList){
        console.log(i)
        if(!self.isValidate(self.device.lightList[i].name)){
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
