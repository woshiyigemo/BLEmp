<template>
	<div class="page">
    <!-- <input type="file" class="upload-input" accept="image/*"> -->
		<div class="page__bd">
            <div class="weui-cells" >
            <a class="weui-cell weui-cell_access"  >
                <div class="weui-cell__bd" data-optionkey="localName" :data-optionVal="switchCopy.localName" @tap="navTo">
                    <p>设备名称</p>
                </div>
                <div class="weui-cell__ft" v-html="switchCopy.localName||''"></div>
            </a>
            <a class="weui-cell weui-cell_access" data-optionkey="pwd" :data-optionVal="switchCopy.pwd" @tap="navTo" >
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
                      <switch  :checked="!switchCopy.backlightStrong" @change="changeBacklightStrongState"/>
                  </div>
              </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">弱背光</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!switchCopy.backlightWeak" @change="changeBacklightWeakState"/>
                  </div>
              </div>
              <div class="weui-cell weui-cell_switch"  style="padding-right:5px;">
                  <div class="weui-cell__bd">信号增强</div>
                  <div class="weui-cell__ft">
                      <switch  :checked="!!switchCopy.signalStrong" @change="changeSignalState"/>
                  </div>
              </div>
	        </div>

        	<div class="weui-cells__title">列表</div>
          <div class="weui-cells">
            <a class="weui-cell weui-cell_access" data-optionkey="lightName" :data-optionLightIndex="index" :data-optionVal="light.name" @tap="navTo" v-for="(light, index) in switchCopy.lightList" :key="light.deviceId">
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
    
    <!-- <div class="weui-btn-area">
        <button class="weui-btn mbottom50" type="default" @tap="taptest">保存</button>
    </div> -->
	</div> 
</template>

<script>
import BLEpub from '@/mixin/BLEpub.js'
import BLE from '@/utils/BLEservice'
import Comm from '@/utils/common.js'
import Config from '@/utils/Config.js'
import qs from 'qs'
import { mapState, mapGetters} from 'vuex'
import { error } from 'util';
export default  {

  data: function(){
    return {
        isInteracting: false,
        isNavigating: false,
        framewareUrl: 'http://x.hao61.net/bluetemp/LOLAR-SW-180317.bin',
    }
  },
  computed: {
    ...mapState({
      switchCopy(state) {
        // console.log(999999,this,this.deviceId,JSON.stringify(state.switchList[this.deviceId]))
        if(!state.switchList[this.deviceId]) {
          wx.showLoading()
          wx.showToast({
            title:'未获取到正确的设备',
            icon:"none",
            mask:true,
            duration:800,
            complete:(rs) => {
              wx.navigateBack({
                delta: 1,
                complete:() => {
                    wx.hideLoading()
                }
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
    navTo (e) {
        if(this.isNavigating) return
        
        var params = {
            deviceId: this.deviceId,
            key: e.currentTarget.dataset.optionkey,
            val: e.currentTarget.dataset.optionval
        }
        if(typeof e.currentTarget.dataset.optionlightindex !== 'undefined') params.lightIndex = e.currentTarget.dataset.optionlightindex
        let p = qs.stringify(params)
        // console.log(p, this.deviceId, e.currentTarget.dataset.optionval, encodeURIComponent(e.currentTarget.dataset.optionval))
        this.isNavigating = true
        wx.showLoading()
        wx.navigateTo({
            url: '/pages/optionchange/main?' + p,
            complete:() => {
                this.isNavigating = false
                wx.hideLoading()
            },
        })
    },
    // 变动静音选项
    changeMuteState(e){
        if(this.isInteracting) return 
        wx.showLoading({
            title:"正在写入",
            mask:true
        })
        console.log("当前静音状态：",e.target.value)
        this.isInteracting = true
        var mute = e.target.value == true?1:0,
            data = 0x05
        this.setDeviceOption(data)
        .then((res) => {
            wx.showToast({
                title:"修改成功",
                icon: 'none',
                duration:1000
            })
            this.isInteracting = false
        }).catch((err) => {
            wx.showToast({
                title:"修改失败",
                icon: 'none',
                duration:1000
            })
            this.isInteracting = false
        })  	
    },

    changeBacklightStrongState(e){
        if(this.isInteracting) return 
        wx.showLoading({
            title:"正在写入",
            mask:true
        })
        console.log("当前强背光状态：",e.target.value)
        this.isInteracting = true
        var mute = e.target.value == true?1:0,
            data = 0x07
        this.setDeviceOption(data)
        .then((res) => {
            wx.showToast({
                title:"修改成功",
                icon: 'none',
                duration:1000
            })
            this.isInteracting = false
        }).catch((err) => {
            wx.showToast({
                title:"修改失败",
                icon: 'none',
                duration:1000
            })
            this.isInteracting = false
        })  	
    },
    changeBacklightWeakState(e){
        if(this.isInteracting) return 
        wx.showLoading({
            title:"正在写入",
            mask:true
        })
        console.log("当前弱背光状态：",e.target.value)
        this.isInteracting = true
        var mute = e.target.value == true?1:0,
            data = 0x06
        this.setDeviceOption(data)
        .then((res) => {
            wx.showToast({
                title:"修改成功",
                icon: 'none',
                duration:1000
            })
            this.isInteracting = false
        }).catch((err) => {
            wx.showToast({
                title:"修改失败",
                icon: 'none',
                duration:1000
            })
            this.isInteracting = false
        })  	
    },  

    changeSignalState(e){
        if(this.isInteracting) return 
        wx.showLoading({
            title:"正在写入",
            mask:true
        })
        console.log("当前信号强度：",e)
        this.isInteracting = true
        var mute = e.target.value == true?1:0,
            data = 0x08
        this.setDeviceOption(data)
        .then((res) => {
            wx.showToast({
                title:"修改成功",
                icon: 'none',
                duration:1000
            })
            this.isInteracting = false
        }).catch((err) => {
            wx.showToast({
                title:"修改失败",
                icon: 'none',
                duration:1000
            })
            this.isInteracting = false
        })  	
    },  
    // 设置参数
    setDeviceOption(value){
        var dId = this.deviceId,
            sId = Config.SampleGattAttributes.SIMPLEIO_SERVICE,
            cId = Config.SampleGattAttributes.SIMPLEIO_CHAR1_CHARACTERISTIC

        var val = new ArrayBuffer(1),
            dataView = new DataView(val)
            dataView.setUint8(0,value)
        return new Promise((resolve,reject) => {
            BLE.writeBLECharacteristicValue(dId,sId,cId,val)
            .then((res) => {
                console.log("设置设置成功")
                var readcId = Config.SampleGattAttributes.SIMPLEIO_CHAR2_CHARACTERISTIC
                return  BLE.readBLECharacteristicValue(dId, sId, readcId)
            }).then((res) => {
                console.log('读取成功', res)
                resolve(res)
            }).catch((err) => {
                console.log('读取失败', err)
                reject(err)
            })
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
    if (!query.deviceId){
      return
    }
    this.deviceId = decodeURIComponent(query.deviceId)
    console.log('this.deviceId',this.deviceId)
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
