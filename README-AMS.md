# AvaMax-Music-Station

> 该项目是一个一站式歌手资料粉丝站。使用 Mock + vue.config.js + Axios 虚拟数据请求，项目中用到 Vue Router 和 Element UI & ECharts & Cesium 等第三方库构建页面，其他如 Vuex & Nprogress 等。

---

## Mock 虚拟数据方案说明

本项目的 Mock 方案采用 自动化注册 + 模块化配置 的设计模拟后端接口，支持动态响应、参数校验、错误模拟等特性。

### 核心设计思路：

每个业务模块独立一个 .js 文件（如 audio.js），导出该模块所有 Mock 接口配置。

mock/index.js 自动扫描 mock/ 目录下的所有 .js 文件，动态注册到 devServer。

通过环境变量 VUE_APP_MOCK 控制是否启用 Mock。

### 接口注册流程

1. 启动项目，vue.config.js 的 before 钩子调用 mockServer()
2. mock/index.js 被加载，判断 VUE_APP_MOCK 是否为 true
3. 开始执行 mockServer()，利用 Node.js 自带的 fs 模块遍历得到 mock/ 目录下除 index 外的所有 .js 文件
4. 所有接口模块都是以 module.exports = [] 的形式导出的，对该模块导出的数组进行遍历，得到每个接口的配置
5. 调用 app.get 或 app.post 将接口注册到 devServer 路由表中
6. 当组件发出请求时，跟据请求路径触发对应接口的 response，实现 Mock 数据的拦截和响应

## 完整流程

[启动项目]
vue.config.js 的 before 钩子调用 mockServer()
[mock/index.js]
1. 判断 VUE_APP_MOCK 是否为 true
2. fs.readdirSync(\_\_dirname) 获取 mock/ 目录下所有文件
3. 遍历接口模块文件，排除 index.js
4. 获取接口模块导出的数组，遍历数组，得到每个接口的配置
5. 将接口注册到 Express 内部的路由表中
    app[method](fullUrl, (req, res) => {
        const result = item.response(req)
        res.json(result)
    })
    - app：Express 应用实例，也就是 devServer 内部的那个服务器对象
    - method：接口请求方法，对应app 的路由注册方法
    - fullUrl：接口请求路径，对应 app[method] 的第一个参数
    - req（request 对象）：包含了浏览器发来的请求信息，比如 URL 参数（req.query）、请求体（req.body）、请求头（req.headers）等。
    - res（response 对象）：用来构建并发送响应给浏览器。它有一系列方法，比如 res.json()、res.send()、res.status() 等。
    - item.response：接口的响应函数，返回一个对象，该对象会被 res.json() 方法序列化为 JSON 格式，并作为响应体发送给浏览器。
6. 注册完成，devServer 启动完毕，此时路由表里有类似这样的条目（伪代码）：
    - 方法：GET
    - 路径：/api/audio/list
    - 处理函数：(req, res) => { const result = item.response(req); ... }
[组件发出请求]
调用 getAudioList()
[axios实例]
baseURL = '/api' （从 .env 读取）
url = '/audio/list'
完整请求地址 = http://localhost:9528/api/audio/list
[浏览器]
发送 GET 请求到 devServer
[devServer]
1. 在路由表中找到对应请求地址的路由信息 → GET /api/audio/list (req, res) => { ... }
2. 执行这个回调
3. 调用 audio.js 中定义的 response 函数
[response]
1. 读取 audioList.json（启动时已加载到内存）
2. 执行逻辑（如分页、查找等）
3. 返回对象 { code: 20000, data: {...} }
[devServer]
res.json(result) 发送 JSON 响应
[浏览器]
收到响应
[axios响应拦截器]
检查 res.code === 20000 ？
   - 是 → 返回 res
   - 否 → 弹出错误提示
[Vue组件]
拿到最终数据，渲染页面

---

## 页面设计

页面由统一的Layout层导入到 App.vue，其中包含 Header & AppMain 主控区域，根据路由变化动态渲染子组件。
ControlBar & LyricsBar & SideBar 实现歌曲播放相关功能

### 路由设计

Layout
  - Header
  - SideBar
  - ControlBar
  - LyricsBar
  - AppMain
    - Home
    - Annals
    - Realeases
    - News
    - Tour
    - PlayList
    - Feed
    - Charts
      - Albums
      - Singles
      - Accounts

### NProgress加载进度条

基于 NProgress 库实现的这个进度条，用于在页面加载和路由切换时在浏览器顶部显示一个细长的进度动画，提升用户体验。

核心功能
- 首次加载页面：显示进度条，页面完全加载后自动消失。
- 路由切换：当用户点击菜单切换页面时，再次显示进度条，新组件渲染完成后隐藏。
- 错误处理：路由加载失败时，主动结束进度条并打印错误。

主要配置
NProgress.configure({
  easing: 'ease',      // 动画缓动函数
  speed: 500,          // 递增动画速度（毫秒）
  showSpinner: false,  // 不显示右上角的加载圆圈
  trickleSpeed: 200,   // 自动递增间隔
  minimum: 0.08,       // 起始最小百分比
  parent: '#app'       // 进度条挂载的父容器
})

utils/nprogress.js 中导出四个方法：
1. initPageLoadProgress()
  - 作用：页面初始化时监听 document.readyState 和 window.load，处理首次页面加载的进度条
  - 调用：在 router/index.js 创建路由后执行
2. startRouteProgress() 
  - 作用：非首次加载的路由跳转时启动进度条
  - 调用：在 router.beforeEach 前置守卫中调用
3. finishRouteProgress() 
  - 作用：路由跳转完成后延迟 300ms 后结束进度条
  - 调用：在 router.afterEach 后置守卫中调用
4. handleRouteError() 
  - 作用：路由加载失败时，主动结束进度条并打印错误。
  - 调用：在 router.onError 中调用

---
