import request from '@/utils/request'

// 获取音频列表
export function getAudioList() {
  return request({
    url: '/audio/list',
    method: 'get'
  })
}

// 获取音频列表
export function getAudioById(id) {
  return request({
    url: `/audio?id=${id}`,
    method: 'get'
  })
}
