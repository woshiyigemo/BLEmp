<template>
  <div class="container">
    <div class="back"></div>
    <div class="media-wrapper">
      <div class="screen-shot-wrapper">
        <div class="topline">
            <div class="lefticon" @tap="scanBluetooth">
              <image :src="imgSrc.add3x"/>
            </div>
            <div class="title">
              设备列表
            </div>
            <div class="righticon" @tap="refreshAutoScan">
              <image :class="isRefreshing ? 'icon-rotate' : ''" :src="imgSrc.refresh3x"/>
            </div>
        </div>
        <div class="switch-line" v-for="(item, index) in switchList" :key="index"> 
          <lampSwitch :switchItem="item"></lampSwitch>
        </div>
        <div class="noswitch">
          <image class="noswitch-img" style="width:144px;height:144px;"  :src="imgSrc.noswitch3x"/>
          <div class="noswitch-text">没有可连接的蓝牙设备</div>
        </div>
      </div>
    </div>
    <!-- 底部菜单 -->
    <bottomNav
    :showBack="true"
    :showAbout="true"
    :showLogout="true"
    v-on:goBack="goBack"
    v-on:logout="logout"
    ></bottomNav>
  </div>
</template>

<script>
// 静态资源
import add3x from '@/images/@3x/add@3x.png'
import refresh3x from '@/images/@3x/refresh@3x.png'
import noswitch3x from '@/images/@3x/noswitch@3x.png'
// 组件
import bottomNav from '@/components/bottomNav'
import lampSwitch from '@/components/lampSwitch'
import BLEpub from '@/mixin/BLEpub.js'
export default {
  data () {
    return {
      imgSrc: {
        add3x: add3x,
        refresh3x: refresh3x,
        noswitch3x: noswitch3x
      },
      switchList: [],
      isRefreshing: false // 自动刷新
    }
  },

  components: {
    bottomNav,
    lampSwitch
  },
  mixins:[BLEpub],
  methods: {
    // 手动刷新
    scanBluetooth(e){
      var self = this
      wx.showLoading({
        title:"正在搜索新设备",
        mask:true
      })
      // 先断开所有设备并关闭蓝牙适配器(安卓)
      // self.disConnAll()
      // .then(function(res){
      //    // console.log("新设备扫描完毕")
      //    return self.scanDevice(true)
      // }).then(function(res){
      //   console.log("新设备扫描完毕",self.switchList)
      //   self.$apply()
      //   self.getSwitchListHis()
      // }).catch(function(err){
      //   console.log("新设备扫描设备发生错误1",err)
      //   self.errHandler(err)
      // })
      console.log("开始手动新设备扫描") 
    },
    // 自动刷新
    refreshAutoScan (e) {
      var self = this
      wx.showLoading({
        title:"正在刷新列表",
        mask:true
      })
      this.isRefreshing = true
      // this.disConnAll()
      // .then(function(res){
      //   return self.scanDevice()
      // }).then(function (){
      //   this.isScanning = false
      // }).catch(function(err){
      //   this.isScanning = false
      //   self.errHandler(err)
      // })
      console.log("refreshing")
    },
    // 去控制页
    goBack (){

    },
    // 退出小程序回调 
    logout (){

    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>

<style scoped lang="less">

  .userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .userinfo-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }

  .userinfo-nickname {
    color: #aaa;
  }
  .media-wrapper{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:80px;
    background:transparent;
  }


  .switch-block{
    height:auto!important;
  }
  .screen-shot-wrapper{
    background-color:#fff;
    margin:22px 20px 20px 20px;
    padding:4px 6px 0 6px;
    min-height:320px;
    max-height:440px;

    border-radius:3px;
    box-shadow: 0 0 20px #888888; 
    overflow:scroll;
  }
  .swiper-wrapper{
    height:100%;
  }
  .bottom-nav{
    position:absolute;
    left:0;
    right:0;
    height:80px;
    bottom:0;
  }


.topline{
  overflow:hidden;
  border-bottom:1px solid #eeeeee;
  display:flex;
  padding-bottom:4px;
  flex-direction:row;
  overflow:hidden;
  margin-bottom:8px;
}
.topline .lefticon{
  width:32px;
  height:32px;
  padding-left:8px;
  padding-top:8px;
}
.lefticon image,
.righticon image{ 
  height: 24px;
  width: 24px;
}
.icon{
  width:32px!important;
  height:32px!important;
  display:block;
}

.topline .righticon{
  width:32px;
  height:32px;
  padding-left:8px;
  padding-top:8px;
}
.topline .title{
  height:40px;
  line-height:40px;
  flex:1;
  text-align:center;
  overflow:hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

.noswitch{
  position:relative;
  overflow:hidden;
}
.noswitch image{

}
.noswitch-img{
  margin:36px auto 36px auto;
  width:144px;
  height:144px;
  display:block;
}
.noswitch-text{
  width:100%;
  text-align:center;
  color:#c4c4c4;
  font-size:14px;
  margin-bottom:48px;
}

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
.icon-rotate{
  -webkit-animation: rotate .75s 0s linear infinite;
  animation: rotate .75s 0s linear infinite;
}

@keyframes rotate{
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
</style>
