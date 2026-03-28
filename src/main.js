import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import Cesium from 'cesium/Cesium'
// import 'cesium/Build/Cesium/Widgets/widgets.css'
// Vue.prototype.Cesium = Cesium // 将 Cesium 注册为 Vue 实例的属性

import ElementUI from 'element-ui' // 引入element-ui
import 'element-ui/lib/theme-chalk/index.css' // 引入element-ui的css
Vue.use(ElementUI) // 全局注册element-ui

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
