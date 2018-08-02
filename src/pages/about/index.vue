<template>
  <div class="page__bd">
    <div class="weui-cells weui-cells_after-title">
        <div @tap="goInsturction" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
            <div class="weui-cell__bd">使用说明</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </div>
        <!-- <navigator url="/pages/fqa" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
            <div class="weui-cell__bd">FQA</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </navigator> -->
        <div @tap="goAboutDetail" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
            <div class="weui-cell__bd">关于</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      goInsturction(){
        wx.navigateTo({
          url: '/pages/instruction/main'
        })
      },
      goAboutDetail(){
        wx.navigateTo({
          url: '/pages/aboutdetail/main'
        })
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

</style>
