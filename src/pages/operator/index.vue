<template>
  <div class="container">
    <div class="back"></div>
    <!-- <tabbar :list.sync="switchList" :chooesenIndex.sync="currentSwitchIndex"></tabbar> -->
    <div class="tips-block">
    </div>
    <div class="media-wrapper">
        <swiper class="swiper-wrapper" :duration="duration" :circular="false" @change="sliderSwitch">
          <block v-if="switchList.length > 0" v-for="(lampInstance, index) in switchList" :key="index">
            <swiper-item class="switch-block">
                  <div class="screen-shot-wrapper">
                    <lamp :lamp="lampInstance" @tapOption="goOption"></lamp>
                  </div>
            </swiper-item>
          </block>
        </swiper>
    </div>
  </div>
</template>

<script>
// 静态资源
import add3x from '@/images/@3x/add@3x.png'
import refresh3x from '@/images/@3x/refresh@3x.png'
import noswitch3x from '@/images/@3x/noswitch@3x.png'
// 组件
import bottomNav from '@/components/bottomNav'
import lamp from '@/components/lamp'

import BLEpub from '@/mixin/BLEpub.js'
import BLE from '@/utils/BLEservice'
import { mapState, mapGetters } from 'vuex'
// console.log(7878898,BLEpub)/
export default {
  data () {
    return {
      imgSrc: {
        add3x: add3x,
        refresh3x: refresh3x,
        noswitch3x: noswitch3x
      },
      // switchList: [],
      isRefreshing: false, // 自动刷新
      isNavigating: false
    }
  },
  computed:{
    ...mapState({
      switchList(state) {
        var slist = []
        for(var i in state.switchList){
          if(state.switchList[i].status === 0){
            slist.push(state.switchList[i])
          }
        }
        return slist
      }
    })
  },
  components: {
    lamp,
    bottomNav
  },
  mixins:[BLEpub],
  methods: {
    // 跳转设置
    goOption (deviceId){
      if(this.isNavigating) return
      this.isNavigating = true
      console.log('跳转设置',deviceId)
      wx.navigateTo({
        url: '/pages/switchoption/main?deviceId=' + encodeURIComponent(deviceId),
        complete:() => {
          this.isNavigating = false
        },
      })
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
  },
  onLoad () {
    console.log('page loaded')
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
