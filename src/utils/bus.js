import Vue from 'vue'

const eventBus = new Vue()

// 存储所有事件的最新状态
const eventState = {}

// 发射事件并自动保存状态
eventBus.emitState = function(eventName, data) {
  // 保存状态到本地并代替发射事件
  // 因此在组件中不再使用使用$emit
  eventState[eventName] = data
  this.$emit(eventName, data)
}

// 获取指定事件的当前状态
eventBus.getState = function(eventName) {
  // 返回对应事件的最新状态 无则返回null
  return eventState[eventName] || null
}

// 清空指定事件的状态
eventBus.clearState = function(eventName) {
  if (eventState.hasOwn(eventName)) {
    delete eventState[eventName]
  }
}

export default eventBus
