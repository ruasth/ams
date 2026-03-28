/**
 * 粘性模块
 * state: 状态数据
 * mutations: 同步修改状态
 * actions: 异步操作
 * getters: 计算属性
 */

const state = () => ({
  /**
   * 1.所有需要监控的固定元素的信息
   * @typedef {Array} stickyElements
   * @property {string} id - 唯一标识
   * @property {string} name - 元素名称
   * @property {number} offsetTop - 距离页面顶部的偏移量
   * @property {boolean} isFixed - 是否固定
   * @property {number} height - 元素高度 vh
   */
  stickyElements: [], // 存储元素信息

  // 2.当前滚动位置
  scrollTop: 0,

  // 3.固定偏移量
  stickyOffset: 80 // 当元素距离顶部达到这个偏移量时，触发固定

})

const mutations = {
  // 1.添加元素到状态列表中
  ADD_ELEMENT(state, element) {
    state.stickyElements.push(element)
  },

  // 2.更新元素的固定状态
  // 当元素要触发固定时 就会调用此方法 传入其id和固定状态用以更新
  UPDATE_ISFIXED_STATUS(state, { id, isFixed }) {
    // 跟据传入的id在状态列表中查找这个元素
    const element = state.stickyElements.find(item => item.id === id)
    // 找到了 更新其固定状态
    if (element) element.isFixed = isFixed
  },

  // 3.从状态列表中删除元素
  REMOVE_ELEMENT(state, id) {
    // 跟据传入的id在状态列表中查找这个元素
    const index = state.stickyElements.findIndex(item => item.id === id)
    // 找到了 删除这个元素
    if (index !== -1) state.stickyElements.splice(index, 1)
  }

}

const actions = {
  // 1.注册固定元素
  registerElement({ commit }, element) {
    const id = element.id
    commit('ADD_ELEMENT', {
      ...element,
      id
    })
    return id
  },

  // 2.注销元素
  unregisterElement({ commit }, id) {
    commit('REMOVE_ELEMENT', id)
  },

  // 3.滚动监听组件状态
  handleScroll({ commit, state }) {
    window.requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // 更新每个元素的固定状态
      state.stickyElements.forEach(element => {
      // 当我滚动的高度已经>=元素的位置-偏移量时 就触发固定
        const shouldBeFixed = scrollTop >= element.offsetTop - state.stickyOffset
        // 如果当前状态与目标状态不一致 就更新 传入id和状态
        if (shouldBeFixed !== element.isFixed) {
          commit('UPDATE_ISFIXED_STATUS', {
            id: element.id,
            isFixed: shouldBeFixed
          })
        }
      })
    })
  },

  // 4.初始化滚动监听
  initScrollListener({ dispatch }) {
    // 先处理一次当前滚动位置
    dispatch('handleScroll')
    // 然后监听滚动事件 这个监听放在index.vue里
    window.addEventListener('scroll', () => dispatch('handleScroll'))
  }
}

const getters = {
  // 1.计算所有固定元素的总高度
  totalFixedHeight: (state) => {
    return state.stickyElements
      .filter(item => item.isFixed) // 先过滤触发固定的元素
      .reduce((total, item) => total + item.height, 0) // 累加计算触发固定的元素的高度
  },

  // 2.让组件获取自己的固定状态
  getElementState: (state) => (id) => {
    // 从状态列表中查找这个元素
    const element = state.stickyElements.find(item => item.id === id)
    // 如果找到 就返回其固定状态 否则返回空对象
    return element ? { ...element } : {}
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
