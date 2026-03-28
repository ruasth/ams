const state = () => ({
  // 存储元素信息
  /**
   * id // 唯一标识
   * name // 元素名字
   * height // 元素高度
   * offsetTop // 元素偏移量
   * isFixed // 固定状态
   */
  stickyElement: []

})

const mutations = {
  // 1.添加元素
  ADD_ELEMENT(state, element) {
    state.stickyElement.push(element)
  },
  // 2.更新元素固定状态
  UPDATE_ELEMENT(state, { id, isFixed }) {
    // 跟据id查找目标元素
    const element = state.stickyElement.find(item => item.id === id)
    if (element) {
      element.isFixed = isFixed
    }
  },
  // 3.删除元素
  DELETE_ELEMENT(state, id) {
    const index = state.stickyElement.findIndex(item => item.id === id)
    if (index !== -1) state.stickyElement.splice(index, 1)
  }
}

const actions = {
  // 1.注册元素
  registerElement({ commit }, element) {
    const id = element.id
    commit('ADD_ELEMENT', {
      ...element,
      id
    })
    return id
  },
  // 2.滚动监听
  handleScroll({ commit, state }) {
    // 防抖
    window.requestAnimationFrame(() => {
      // 获取当前滚动位置
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      // 循环遍历每个元素
      state.stickyElement.forEach(element => {
        const shoundFixed = scrollTop >= element.offsetTop - 80
        // 判断当前元素固定状态
        if (shoundFixed !== element.isFixed) {
        // 调用mutation更新元素固定状态
          commit('UPDATE_ELEMENT', {
            id: element.id,
            isFixed: shoundFixed
          })
        }
      })
    })
  },
  // 3.初始化滚动监听
  initScrollListener({ dispatch }) {
    // 首先先处理一次当前滚动位置
    dispatch('handleScroll')
    // 然后监听滚动事件
    // 挂载到home的index
    window.addEventListener('scroll', () => dispatch('handleScroll'))
  },
  // 4.销毁元素/滚动监听
  unregisterElement({ commit }, id) {
    commit('DELETE_ELEMENT', id)
  }
}

const getters = {
  // 1.获取固定元素的总高度
  totalFixedHeight(state) {
    // 返回总高度 在home的index中计算
    return state.stickyElement
      .filter(element => element.isFixed)
      .reduce((total, element) => total + element.height, 0)
  },
  // 2.获取元素固定状态
  getElementState: (state) => (id) => {
    // 从状态列表中查找这个元素
    const element = state.stickyElement.find(item => item.id === id)
    // 返回这个元素的固定状态
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
