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
 registerElement({ commit }, element) {
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

项目描述：结合音乐数据与地理信息技术的综合展示平台，包含音乐播放器、巡演路线可视化地图及动态数据仪表盘。
技术栈：Vue 2、Vue-router、Vuex、Element-UI、ECharts、Cesium.js、Axios
项目内容：
.音乐资料馆，通过mock虚拟数据与

1. 模拟数据驱动层
针对音乐作品、艺人编年史、巡演坐标等数据内容，独立设计并构建了一套JSON格式的虚拟数据库。
采用自动化注册+模块化配置的设计模拟后端接口，支持动态响应、参数校验、错误模拟等特性。

2. 页面构成与全局主题视觉体系
采用组件化思想构建了层叠式主页、作品画廊、新闻窗口、数据看板、音乐播放器、滚动歌词、3D巡演交互地图等板块。
基于SCSS搭建全局样式系统，封装了多个高复用组件样式，提升了样式的工程化维护效率。
对Element-UI的原生组件（如 Message/Dialog）进行了主题重绘，使其融入项目的视觉语言，消除了第三方组件的违和感，实现全站交互逻辑与视觉调性高度统一的视觉风格。

3. 核心技术栈实现
状态机与音频控制：基于Vuex与原生HTML5 Audio API封装了核心音乐播放器，实现了处理音频播放、进度跳转及Apple Music风格的滚动歌词逻辑。
3D地理信息集成：运用Cesium.js引擎，通过经纬度映射将虚拟巡演数据转化为3D空间实体，并动态绘制可视化航线轨迹。
数据可视化：通过封装ECharts通用容器组件与generaterSeries工具类实现图表配置项的动态自动化生成，并配合组件生命周期内的实例销毁，大幅提升了可视化模块的开发效率与可维护性。

--- 

模拟数据驱动层
1.
独立设计并实现了一套基于JSON格式的虚拟数据库系统，用于模拟音乐作品、艺人编年史及巡演坐标等数据内容。
2.
通过模块化配置与自动化注册机制，构建出具备动态响应、参数校验及错误模拟能力的数据接口层，有效模拟后端服务行为，提升了开发效率与系统可维护性。


•
页面构成与全局主题视觉体系
1.
基于组件化开发理念，构建了包括层叠式主页、作品画廊、新闻窗口、数据看板、音乐播放器、滚动歌词及3D巡演交互地图等多个核心页面模块。
2.
采用SCSS搭建全局样式系统，封装了多个高复用样式组件，显著提升了样式管理的维护效率。
3.
对Element-UI的原生组件进行了主题重绘，使其与项目整体视觉风格融合，消除了第三方组件的违和感，实现全站在交互逻辑与视觉调性上的高度统一。


•
核心技术栈实现
1.
状态管理与音频播放：基于Vuex与原生HTML5 Audio封装了核心音乐播放器，实现了处理音频播放、进度跳转及Apple Music风格的滚动歌词逻辑。
2.
通过封装ECharts通用容器组件与generaterSeries工具类，实现图表配置项的动态生成与自动销毁，有效提升了可视化模块的开发效率与代码可维护性。
3.
在3D地理信息集成方面，使用Cesium.js引擎将虚拟巡演数据映射为3D空间实体，并动态绘制航线轨迹，增强了用户对地理信息的沉浸式感知体验。



1. 独立设计并实现了一套基于JSON格式的虚拟数据库系统，用于模拟音乐作品、艺人编年史及巡演坐标等数据内容。通过模块化配置与自动化注册机制，构建出具备动态响应、参数校验及错误模拟能力的前端数据接口层，有效模拟后端服务行为，提升了开发效率与系统可维护性。
2. 基于组件化开发理念，构建了包括层叠式主页、作品画廊、新闻窗口、数据看板、音乐播放器、滚动歌词展示及3D巡演交互地图在内的多个核心页面模块。采用SCSS搭建全局样式系统，封装了多个高复用样式组件，显著提升了样式管理的工程化水平与维护效率。对Element-UI组件进行了主题定制与视觉重绘，使其与项目整体视觉风格无缝融合，实现了前后端组件在交互逻辑与视觉调性上的高度统一。
3. 在核心技术实现方面，基于Vuex与HTML5 Audio封装了核心音乐播放器模块，实现了音频播放控制、进度跳转及Apple Music风格的滚动歌词展示功能。通过开发ECharts通用容器组件与generaterSeries工具类，实现了图表配置项的动态生成与自动销毁，有效提升了可视化模块的开发效率与代码可维护性。在3D地理信息集成方面，使用Cesium.js引擎将虚拟巡演数据映射为3D空间实体，并动态绘制航线轨迹，增强了用户对地理信息的沉浸式感知体验。