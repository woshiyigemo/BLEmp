<template>
	<div class="page">
		<div class="page__bd">
      <div class="weui-article">
          <div class="weui-article__section">
              
          </div>
          <div class="weui-article__section">
            <div class="weui-article__section">
                  <div class="weui-article__p">
                      1.首次使用时，请点击左上角加号按钮来搜索和新增设备。新增的设备在配对成功后将保存在手机上，小程序再次启动时将直接可见。
                  </div>
                  <div class="weui-article__p">
                      <img mode="widthFix" class="w100" src="../../images/static/1.png"/>
                  </div>
            </div>
            <div class="weui-article__section">
                  <div class="weui-article__p">
                      2.点击新设备进行蓝牙连接，第一次连接时系统会弹出蓝牙配对密码(PIN)的输入提示，出厂默认密码为888888。
                  </div>
                  <div class="weui-article__p">
                      <img mode="widthFix"  class="w100" src="../../images/static/2.png"/>
                  </div>
            </div>
            <div class="weui-article__section">
                  <div class="weui-article__p">
                      3.配对成功后进入开关控制界面，点击右侧圆形电源按钮来打开和关闭电灯。点击下方列表按钮可返回列表页面以连接其他设备。当连接多个设备时，可在控制界面滑动切换设备。
                  </div>
                  <div class="weui-article__p">
                      <img mode="widthFix" class="w100" src="../../images/static/3.png"/>
                  </div>
            </div>
            <div class="weui-article__section">
                  <div class="weui-article__p">
                      4.列表页面显示的设备可能处于离线状态，表示未在附近搜索到该设备，此时可通过手动点击右上角刷新按钮来重新搜索。
                  </div>
                  <div class="weui-article__p">
                      5.在控制界面中，点击左上方的齿轮按钮可以进入开关设置界面。静音：打开/关闭面板的操作提示音；强背光：打开/关闭面板的开灯背光；弱背光：打开/关闭面板的关灯背光；信号增强：打开/关闭面板的蓝牙信号增强功能；更新：更新开关面板固件；列表区可以修改各个电灯的具体名称。设置完成后，点击页面下方保存按钮返回控制界面。
                  </div>
                  <div class="weui-article__p">
                      <img mode="widthFix" class="w100" src="../../images/static/4.png"/>
                  </div>
            </div>
            <div class="weui-article__section">
                  <div class="weui-article__p">
                      6.请使用列表页面的退出按钮来退出小程序，不完全的退出将导致设备在其他手机上不可见。注意，因Android设备种类繁多，部分手机在退出程序后并未真正断开与设备的蓝牙链接，导致设备不能被正常搜索到。此时请将手机蓝牙关闭10秒钟以上再打开，即可重新搜索并连接到设备。
                  </div>
                  <div class="weui-article__p">
                      7.使用面板的触摸按键可恢复出厂设置，一开、三开、四开开关请使用产品正中心处按键，二开开关请使用最左侧按键。持续按复位键5秒钟，按键灯闪烁，随后系统恢复到出厂设置，连接密码恢复为888888。
                  </div>
            </div>
          </div>
      </div>
		</div>
	</div>  
</template>
<script>

  export default {
    data () {
      return {
        imgMode:'widthFix'
      }
    },
    methods: {

    },
    created () {

    },
    onLoad () {
      console.log('page loaded')
    }
  }
</script>

<style scoped lang="less">

</style>