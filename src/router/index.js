import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout'
// import Lyric from '@/layout/lyric/index'
import {
  initPageLoadProgress,
  startRouteProgress,
  finishRouteProgress,
  handleRouteError
} from '@/utils/nprogress'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      // 首页
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home'),
        meta: { title: '首页' }
      },
      // 纪年馆
      {
        path: '/annals',
        name: 'Annals',
        component: () => import('@/views/annals'),
        meta: { title: '纪年馆' }
      },
      // 作品馆
      {
        path: '/releases',
        name: 'Releases',
        component: () => import('@/views/releases'),
        meta: { title: '作品馆' }
      },
      // 咨询馆
      {
        path: '/news',
        redirect: '/news/all',
        name: 'News',
        component: () => import('@/views/news'),
        meta: { title: '咨询馆' },
        children: [
          {
            path: '/news/all',
            name: 'All News',
            component: () => import('@/views/news/all'),
            meta: { title: '全部资讯' }
          },
          {
            path: '/news/today',
            name: 'Today News',
            component: () => import('@/views/news/today'),
            meta: { title: '今日新闻' }
          }
          // {
          //   path: '/news/videos',
          //   name: 'Video News',
          //   component: () => import('@/views/news/videos'),
          //   meta: { title: '视频新闻' }
          // }
        ]
      },
      // 数据馆
      {
        path: '/charts',
        name: 'Charts',
        component: () => import('@/views/charts'),
        meta: { title: '数据馆' },
        children: [
          {
            path: '/charts',
            name: 'overview',
            component: () => import('@/views/charts/overview'),
            meta: { title: '榜单图表' }
          },
          {
            path: '/charts/albums',
            name: 'Albums Charts',
            component: () => import('@/views/charts/albums'),
            meta: { title: '榜单图表 - 专辑' }
          },
          {
            path: '/charts/singles',
            name: 'Singles Charts',
            component: () => import('@/views/charts/singles'),
            meta: { title: '榜单图表 - 单曲' }
          },
          {
            path: '/charts/accounts',
            name: 'Accounts Charts',
            component: () => import('@/views/charts/accounts'),
            meta: { title: `榜单图表 - 账号` }
          }
        ]
      },
      // 其他页面
      {
        path: '/tour',
        name: 'Tour',
        component: () => import('@/views/others/tour'),
        meta: { title: '巡演路线' }
      },
      {
        path: '/playlist',
        name: 'PlayList',
        component: () => import('@/views/others/playList'),
        meta: { title: '巡演歌单' }
      },
      {
        path: '/feed',
        name: 'FeedBack',
        component: () => import('@/views/others/feed'),
        meta: { title: '意见反馈' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 初始化页面加载进度条
initPageLoadProgress()

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 开始路由切换进度条
  startRouteProgress(from.path, to.path)

  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title ? `AMS | ${to.meta.title}` : 'AMS'
  }

  next()
})

// 全局后置钩子
router.afterEach(() => {
  // 完成路由切换进度条
  finishRouteProgress()
})

// 路由错误处理
router.onError((error) => {
  handleRouteError(error)
})

export default router
