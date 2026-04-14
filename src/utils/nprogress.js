import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({
  easing: 'ease', // 缓动函数
  speed: 500, // 递增动画速度
  showSpinner: false, // 不显示右上角的加载圆圈
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.08, // 起始最小百分比
  parent: '#app' // 进度条挂载的父容器
})

// 标志位：是否是首次加载页面
let isFirstLoad = true

// 初始化页面加载进度条
export function initPageLoadProgress() {
  if (typeof window === 'undefined') return

  // 页面开始加载时显示进度条
  if (document.readyState === 'loading') {
    // 延迟一点显示，避免进度条一闪而过
    setTimeout(() => {
      NProgress.start()
    }, 100)
  }

  // 页面完全加载后隐藏进度条
  window.addEventListener('load', () => {
    setTimeout(() => {
      NProgress.done()
      isFirstLoad = false
    }, 300)
  })
}

/**
 * 开始路由切换进度条
 * @param {string} fromPath - 来源路径
 * @param {string} toPath - 目标路径
 */
export function startRouteProgress(fromPath, toPath) {
  // console.log(`路由跳转: ${fromPath || '/'} -> ${toPath}`)

  // 如果不是首次加载（即路由切换时）
  if (!isFirstLoad) {
    NProgress.start()
  }
}

/**
 * 完成路由切换进度条
 */
export function finishRouteProgress() {
  // 如果是路由切换（不是首次加载），延迟完成进度条
  if (!isFirstLoad) {
    setTimeout(() => {
      NProgress.done()
    }, 300)
  }
}

/**
 * 处理路由错误
 * @param {Error} error - 路由错误
 */
export function handleRouteError(error) {
  console.error('路由加载失败:', error)
  NProgress.done()
}

/**
 * 获取是否是首次加载
 * @returns {boolean}
 */
export function getIsFirstLoad() {
  return isFirstLoad
}

/**
 * 重置首次加载标志位（可用于用户手动刷新后重置）
 */
export function resetFirstLoad() {
  isFirstLoad = true
}

// 默认导出 NProgress 实例
export default NProgress
