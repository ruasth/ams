* 组件的滚动覆盖效果：

- 组件的具体效果:
 当组件1到达顶部后固定，组件2层级高于组件1，向上滚动就会覆盖组件1，等到组件2到顶部固定

- 在home中几个组件本体其实一样，因此可以创建一个共同逻辑mixin混入和vuex模块方法处理给它们使用
- state中先存储基本数据:
 StickyElement: { // 组元素的信息
    id: 唯一标识
    name: 元素名字
    offsetTop: 距离视口顶部的偏移量
    isFixed: 固定状态
    height: 元素高度 vh
 },
 scrollTop: 元素滚动的距离,
 stickyOffet: 固定偏移量 navbar的高度,
- mixin中定义基本数据
 props: {
    // 元素名字(home传入)，元素高度，固定偏移量(80)
    stickyNmae,
    stickyHeight,
    StickyOffset,
 }
 data() {
    return {
        stickyId: null,
    }
 }

- 首先，计算元素的绝对位置
 1. 获取元素的引用 // 元素中都会传递ref="stickyElement"
 const element = this.$refs.stickyElement
 2. 计算元素相对视口的位置
 // getBoudingClientRect方法会计算元素相对于视口左上的位置
 // .top 元素顶部距离顶部
 // .bottom 元素底部距离顶部
 // .left 元素左侧距离左侧
 // .right 元素右侧距离左侧
 const rect = element.getBoudingClientRect()
 3. 计算相对于文档顶部的位置
 // scrollTop得出的是文档顶部被滚动的偏移量
 const scrollTop = window.pageYOffset || document documentElement.scrollTop
 4. 计算
 // rect.top表示元素顶部相对视口顶部的距离 scrollTop表示文档滚动的距离 这两个值会互相抵消 因此得出元素在页面中的绝对位置
 return rect.top + scrollTop

- 注册组件
 在vuex中定义action注册组件
 registerToStore({ commit }, element) {
    const id = element.id
    commit('ADD_ELEMENT', {
        ...element,
        id
    })
    return
 }
 调用mutation的ADD_ELEMENT 把元素信息存入状态列表
 ADD_ELEMENT(state, element) {
    state.stickyElement.push(element)
 }
 在mixin里 挂载完成后就会注册元素
 mounted() {
    this.$nextTick(() => {
        this.registerToStore()
    })
 }
 methods中:
 registerToStore() {
    // 调用计算位置函数返回位置
    const offsetTop = this.getElementOffsetTop()
    // 生成id
    const id = `${this.stickyName} - ${Date.now()}`
    // 调用action
    this.$store.dispatch('sticky/registerElement',
    {
        // 传入元素信息
        id: id,
        name: this.stickyName,
        offsetTop: offsetTop,
        height: this.stickyHeight,
        isFixed: false
    }).then((resId) => { this.stickyId = resId })
    // registerToStore会触发ADD_ELEMENT把元素信息存到state完成注册 同时返回id
 }

- 组件获取自动状态
 将注册组件时返回的id传入查询状态的getter中
 在computed中调用这个getter
 computed: {
    elementState() {
        // 注册之后才有id
        if (!this.sticktId) return
        // getter闭包传参
        return this.$store.getters['sticky/getElemenState'](this.stickyId)
    }
 }
 定义getter
 getElementState: (state) => (id) => {
    const element = this.state.stickyElement.find(item => item.id === id)
    // 如果element存在 返回状态列表存储的元素数据
    if element ? return {...element} : {}
 }
 在computed计算元素的状态
 isStickyFixed() {
    // 跟据getter中返回的isFixed判断状态
    return this.getElementState.isFixed || false
    // 返回后 组件就有了isFixed
 }

- 滚动监听状态
 handleScroll({ commit, state }) {
    // 获取页面滚动偏移量
    const scrollTop = window.pageYOffset || document documentElement.scrollTop

    state.stickyElement.forEach((item) => {
        // 因为页面滚动和元素相对偏移量是抵消的 所以当scrollTop>=offsetTop减去固定偏移量时 说明元素已经到达固定的位置了 返回给shoundFixes一个true
        const shoundFixed = scrollTop >= item.offsetTop - item.stickyOffset
        // 把应该固定的元素设置为固定状态
        if (shoundFixed !== item.isFixed) {
            // 调用更新状态mutation
            commit('UPDATE.ISFIXED.STATE', {
                id: item.id,
                isFixed: shoundFixed
            })
        }
    })
 }
 // 调用mutation
 UPDATE_ISFIXED_STATE(state, {id, isFixed}) {
    // 使用find寻找需要改变状态的元素
    const element = state.stickyElement.find(item => item.id === id)
    if(element) element.isFixed = isFixed
 }

- 初始化滚动监听
 定义初始化action组件
 initScrollListener({ dispatch }) {
    // 首先处理一次位置
    dispatch('handleScroll')
    // 为window添加监听事件 这个监听放在home的index中
    window.addEventListener('scroll', () => dispatch('handleScroll'))
 }
 // 在home的index的mounted中添加这个监听器
 mounted() {
    this.$nextTick(() => {
        this.store.diapatch('sticky/initScrollListener')
    })
 }

- 计算塌陷区域的高度
 定义计算总高度的getter
 totalFixedHeight: (state) => {
    state.stickyElement
    // 先把状态列表里处于激活的元素筛选出来
    .filter((item) => item.isFixed)
    // 累加计算总高度
    // reduce((初始值从这里开始加, 每个item) => total + item的高, 初始值设置为0)
    .reduce((total, item) => total + item.height, 0)
 }
 在home的indedx中调用这个getter
 computed:{
    ...mapGetters('sticky', ['totalFixedHeight'])

    blanckHeight() {
        return `calc(100vh + ${this.totalFixedHeight}vh + 80px)`
    }
 }

* vue.config.js与Mock模拟数据请求

- 大致流程
  1. 'vue.config.js' 
    触发条件：当 VUE_APP_MOCK = true 环境变量设置时
    执行时机：在 Webpack Dev Server 启动之前
    作用：将 Mock 服务器挂载到 Express 应用实例上

  2. 'mock/index.js' - Mock 服务器入口
    路由注册：将 news.js 中的路由配置注册到 Express 应用
    延迟模拟：添加 300ms 延迟模拟真实网络请求
    统一处理：为所有 Mock 接口提供一致的响应格式

  3. 'mock/news.js' - 新闻数据 Mock 配置
    数据源：从 JSON 文件加载静态数据
    接口定义：
      · URL: /vue-element-admin/news/list
      · 方法: GET
      · 响应格式: {code, data: {total, items}}

  4. 'src/api/news.js' - API 接口封装
    接口抽象：将具体的 URL 和请求方法封装成函数
    统一管理：便于维护和复用

  5. 'src/utils/request.js' - Axios 实例配置
    基础配置：设置超时时间和基础 URL
    响应拦截：
      · 检查 code 是否为 20000（成功状态码）
      · 统一错误处理
      · 返回数据格式统一化
   
   - 完整流程
     1. 组件通过api发起请求 ->
     2. axios实例配置 ->
     3. Webpack Dev Server / before钩子函数: require('./mock')(app) ->
     4. 'mock/news.js' 路由匹配与处理 ->
     5. 'mock/news.js' 读取 JSON 数据并返回