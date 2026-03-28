import request from '@/utils/request'

// 获歌词列表
export function getLyricsList(id) {
  return request({
    url: `/lyrics?id=${id}`,
    method: 'get'
  })
}
