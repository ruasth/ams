import request from '@/utils/request'

// 获取作品列表
export function getReleasesList() {
  return request({
    url: '/releases/list',
    method: 'get'
  })
}

// 获取歌曲简介
export function getSongInfo(id) {
  return request({
    url: `/releases/detail?id=${id}`,
    method: 'get'
  })
}
