
<template>
	<div class="page">
    <div class="page__bd">
      <div class="weui-cells weui-cells_form">
          <div class="weui-cell">
              <div class="weui-cell__hd"><label class="weui-label" v-html="options.name"></label></div>
              <div class="weui-cell__bd">
                  <input class="weui-input" v-model="options.value">
              </div>
          </div>
      </div>
      <div class="weui-btn-area">
          <button class="weui-btn mbottom50" type="default" @tap="saveChange">保存</button>
      </div>
    </div>
	</div> 
</template>

<script>
import BLEpub from '@/mixin/BLEpub.js'
import BLE from '@/utils/BLEservice'
import Comm from '@/utils/common.js'
import Config from '@/utils/Config.js'
import { mapState, mapGetters} from 'vuex'
import { getByteLen, isPwdValid, isNameValid } from '@/utils/pubMethod.js'

// 包括 模块名称/灯名
const mapInfo = {
  localName:'模块名称',
  pwd:'设备密码',
  lightName:(index) => {
    return `灯${index + 1}`
  },
}

export default  {

  data: function(){
    return {
        options: {
            name: '测试',
            key: 'test',
            value: '',
        },
        deviceId: null,
        isNavigating: false 
    }
  },
  computed: {
    ...mapState({
      switchCopy(state) {
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
    getSwitchOption (options) {
      wx.showLoading({
        title:"正在连接",
        mask:true
      })
      this.updatSwitchState(this.deviceId)
        .then(res => {
           wx.hideLoading()
        }).catch(err => {
          
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
          }).then((res) => {
            resolve(res)
          }).catch(function(err){
            reject(err)
            wx.hideLoading()
          })
        })    
    },

    // 保存\设置非记录在设备的参数
    saveChange (e) {
      // if(!this.isStringValidate()) return
      console.log(7777)
      wx.showLoading({
        title:'正在保存',
        mask:true
      })
      this.saveOptions(this.options.value)
        .then(res => {
          wx.hideLoading()
        }).catch(err => {
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
      let res = {
        str:'没有找到对应的字段',
        isValidate:false
      } 
      
      switch (this.options.key.toString())
      {
        case 'lightName':
              res = isNameValid(this.options.value.trim())
              break
        case 'localName':
              res = isNameValid(this.options.value.trim())
              break
        case 'pwd':
              res = isPwdValid(this.options.value.trim())
              break       
      }
      if(!res.isValidate){
        wx.showModal({
            showCancel:false,
            content:res.str
        })
      }
      return res.isValidate
    },  
    
    // 保存
    saveOptions (val) {
      return new Promise((resolve, reject) => {
        switch (this.options.key.toString())
        {
          case 'lightName':
                let light = {
                  value: val,
                  lightIndex: lightIndex
                }
                this.$store.dispatch('changeLightName', { deviceId: this.deviceId, lightIndex: light.lightIndex, value: light.value })
                resolve()
                break
          case 'localName':
                let device = {
                  deviceId: this.deviceId,
                  status: this.switchCopy.status,
                  localName: val
                }
                this.$store.dispatch('changeSwitchState', { deviceId: device.deviceId, device: device })
                resolve()
                break
          case 'pwd':
                this.updatSwitchPwd(this.switchCopy.deviceId, val)
                  .then(res => {
                    resolve(res)
                  }).catch(err => {
                    reject(err)
                  })
                break   
          default:
            reject()    
        }
      })
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
    if (!query.deviceId || !query.key || typeof query.val === 'undefined'){
      wx.showModal({
        showCancel:false,
        content:"缺少参数，点击后返回",
        complete(){
          wx.navigateBack({
            delta:1
          })
        },
      })
      return
    }
    this.deviceId = decodeURIComponent(query.deviceId)
    query.lightIndex ? this.options.lightIndex = decodeURIComponent(query.lightIndex) : null
    this.options.key = decodeURIComponent(query.key)
    this.options.name = query.lightIndex ? mapInfo[this.options.key](query.lightIndex) : mapInfo[this.options.key]
    this.options.value = decodeURIComponent(query.val)
  }
}
</script>

<style scoped lang="less">

</style>
