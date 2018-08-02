import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '使用说明',
    navigationBarBackgroundColor: '#4f8eeb',
    navigationBarTextStyle: 'white'
  }
}
