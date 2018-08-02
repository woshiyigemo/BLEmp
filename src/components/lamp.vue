<template>
  <div>
    <div class="topline">
      <div class="lefticon">
        <image style="width:24px;height:24px;" @tap="setOption" src="../images/@3x/option@3x.png"/>
      </div>
      <div class="title">
        {{lamp.localName}}
      </div>
      <div class="righticon">
        <!-- <image style="width:24px;height:24px;" animation="{{animationData}}" @tap="_refresh"  src="../images/@3x/refresh@3x.png"/> -->
      </div>
    </div>
    <!-- <div class="switch-line" wx:for="{{item.lightList}}" wx:for-item="light"  wx:key="index" wx:if="{{light.visible}}"> -->
    <div 
      v-for="(light, index) in lamp.lightList" 
       :key="index">
      <lightItem :deviceId="lamp.deviceId" :light="light"></lightItem>
    </div>
  </div>
 </template>
 <script>
  import Comm from '@/utils/common' 
  import BLE from '@/utils/BLEservice'
  import lightItem from '@/components/light'

  export default {
    props:{
      // 灯对象
      lamp: {
        type:Object,
        default: {
          deviceId:'0000-0000',
          localName:'',
          status:3,
          lightList:[
            {}
          ]
        },
      }
    },

    data(){
      return {

      }
    },
    computed:{
      
    },
    components:{
      lightItem
    },
    methods:{
      // 设置 
      _setOption(){
        console.log('点击设置')
      },
      _refresh(){
        console.log('点击刷新')
      }
    },
    mounted(){
      console.log('灯状态', this.lamp)
    }
  }
</script>

<style scoped lang="less">
  .container{

  }
  

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
    top:28px;
    left:0;
    right:0;
    bottom:100px;
    background:transparent;
  }


  .switch-block{
    height:auto!important;
  }
  .screen-shot-wrapper{
    background-color:#fff;
    margin:22px 20px 20px 20px;
    padding:4px 6px 0 6px;
    border-radius:3px;
    box-shadow: 0 0 20px #888888; 
    overflow:hidden;
  }
  .swiper-wrapper{
    height:100%;
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


.switch-line{
  border-radius:4px;
  position:relative;
  box-shadow: 0 0 3px #bebebe; 
  overflow:hidden;
  height:56px;
  padding:5px 5px 5px 12px;
  margin-bottom:12px;
}
.switch-line:active{
  background-color:#dedcdc;
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
}

.switch-line .switch-status{
  padding-right:50px;
  font-size:14px;
  color:#999;
  height:28px;
  line-height:28px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
.switch-line .switch-button{
  height:48px;
  width:48px;
  border-radius:999px;
  position:absolute;
  right:0;
  top:0;
  margin:9px;
}
</style>