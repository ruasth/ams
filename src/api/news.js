import request from '@/utils/request'

// 获取新闻预览
export function getNewsList() {
  return request({
    url: '/news/list',
    method: 'get'
  })
}

// 获单条新闻详情
export function getNewsInfo(id) {
  return request({
    url: `/news/info?id=${id}`,
    method: 'get'
  })
}
