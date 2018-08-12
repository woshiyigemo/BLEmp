<template>
    <div class="page__bd page__bd_spacing bottom-nav">
      <div class="weui-flex">
            <div class="weui-flex__item" v-if="showBack"  @tap="goBack">
              <div class="bottom-nav-icon">
                <image :src="imgUrl.back3x"/>
              </div>
              <div class="placeholder">返回</div>
            </div>
            <div class="weui-flex__item" v-if="showList" @tap="goList">
              <div class="bottom-nav-icon">
                <image :src="imgUrl.list3x"/>
              </div>
              <div class="placeholder">列表</div>
            </div>
            <div class="weui-flex__item" v-if="showAbout" @tap="goAbout">
              <div class="bottom-nav-icon">
                <image :src="imgUrl.about3x"/>
              </div>
              <div class="placeholder">关于</div>
            </div>
            <div class="weui-flex__item"  v-if="showLogout" @tap="logout">
              <navigator open-type="exit" target="miniProgram">
                <div class="bottom-nav-icon">
                  <image :src="imgUrl.logout3x"/>
                </div>
                <div class="placeholder">退出</div>
              </navigator>
            </div>
        </div>
    </div>
</template>

<script>
  // 静态资源
  import back3x from '@/images/@3x/back_light@3x.png'
  import list3x from '@/images/@3x/list@3x.png'
  import about3x from '@/images/@3x/about@3x.png'
  import logout3x from '@/images/@3x/logout@3x.png'

  export default {
    props: {
      // 灯对象
      showBack: {
        type: Boolean,
        default: false
      },
      showList: {
        type: Boolean,
        default: false
      },
      showAbout: {
        type: Boolean,
        default: false
      },
      showLogout: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        imgUrl: {
          back3x: back3x,
          list3x: list3x,
          about3x: about3x,
          logout3x: logout3x
        }
      }
    },

    methods: {
      // 返回灯页
      goBack () {
        console.log('goBack')
        this.$emit('goBack')
      },
      // 返回开关列表
      goList () {
        console.log('goList')
        this.$emit('goList')
      },
      // 跳转设置页面
      goAbout () {
        wx.navigateTo({
          url: '/pages/about/main'
        })
        this.$emit('goAbout')
      },
      // 关闭小程序
      logout (e) {
        this.$emit('logout')
      }
    }
  }
</script>

<style scoped lang="less">
  .bottom-nav{
    position:absolute;
    left:0;
    right:0;
    height:80px;
    bottom:0;
  }
  .bottom-nav-icon image{
    width:36px;
    height:36px;
    margin:0 auto;
  }
</style>