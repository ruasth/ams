// 导入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'

// 导入模块
import modules from './modules'

// 让Vue使用Vuex
Vue.use(Vuex)

// 创建并导出store示例
export default new Vuex.Store({
  modules, // 挂载所有模块
  strict: true // 开启严格模式 未经过mutations修改状态会报错
})
