
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
    return `灯${Number(index) + 1}`
  },
}

export default  {

  data: function(){
    return {
        options: {
            name: '',
            key: '',
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
      if(!this.isStringValidate()) return
      wx.showLoading({
        title:'正在保存',
        mask:true
      })
      this.saveOptions(this.options.value)
        .then(res => {
          wx.getStorage({
            key:'switchList',
            success:(res) => {
              console.log('storage结果',res)
            },
            fail:(err) => {
              console.log('storage错误',err)
            }
          })
          wx.showToast({
            icon: 'none',
            title:'保存成功',
            duration:1000,
            mask: true,
            success: () => {
              wx.navigateBack({
                delta: 1,
                complete:() => {
                    wx.hideLoading()
                }
              })
            }
          })
        }).catch(err => {
          wx.showToast({
            icon: 'none',
            title:'保存失败，请尝试重新保存',
            duration:1000,
            mask: true
          })
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
      let key = this.options.key.toString() 
      switch (true)
      {
        case key == 'lightName':
              res = isNameValid(this.options.value.trim())
              break
        case key == 'localName':
              res = isNameValid(this.options.value.trim())
              break
        case key == 'pwd':
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
        let key = this.options.key.toString() 
        console.log('保存前11125', key ,key == 'lightName')
        switch(true)
        {
          case key == 'lightName':
                let light = {
                  value: val,
                  lightIndex: this.options.lightIndex
                }
                console.log('test1',light, this.options.key.toString())
                this.$store.dispatch('changeLightName', { deviceId: this.deviceId, lightIndex: light.lightIndex, value: light.value })
                console.log('test',this.options.key.toString())
                resolve()
                break
          case key=='localName':
                console.log('test2', this.options.key.toString())
                this.$store.dispatch('changeSwitchName', { deviceId: this.deviceId, localName: val })
                resolve()
                break
          case key=='pwd':
                console.log('test3', this.updatSwitchPwd, this.switchCopy, val)
                this.updatSwitchPwd(this.switchCopy.deviceId, val)
                  .then(res => {
                    resolve()
                  }).catch(err => {
                    
                    reject()
                  })
                break
          default:
            console.log('没有对应的key')
            reject()
            break
        }
        console.log('switch完毕')
      })
    },
  },
  mounted(e){
      console.log('参数', e)
  },
  created(e){
    console.log('参数2', e)
  },


  onLoad(query){
    console.log('查询 dev',query)
    if (!query.deviceId || !query.key){
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
    this.options.name = typeof query.lightIndex != 'undefined' ? (mapInfo[this.options.key])(query.lightIndex) : mapInfo[this.options.key]
    console.log('this.options.name',query.lightIndex, this.options.name)
    this.options.value = this.options.key == 'pwd'? '':decodeURIComponent(query.val)
  },
  onUnload(){
    this.options = {
        name: '',
        key: '',
        value: '',
    }
    this.deviceId = null
    this.isNavigating = false 
  }
}
</script>

<style scoped lang="less">

</style>
