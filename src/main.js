import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import '@/icons/index.js' // 引入svg图标

import './styles/global.scss' // 引入全局样式
import '@/styles/nprogress.scss' // nprogress样式

Vue.config.productionTip = false

// 创建Vue实例前先初始化歌曲列表
store.dispatch('player/initAudioList').then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}).catch(err => {
  // 即使请求失败，也正常挂载App（避免页面白屏）
  console.error('歌曲列表初始化失败：', err)
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
