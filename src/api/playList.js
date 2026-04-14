import request from '@/utils/request'

export function getPlayList() {
  return request({
    url: '/playList',
    method: 'get'
  })
}
