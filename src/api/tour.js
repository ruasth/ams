import request from '@/utils/request'

// 获取巡演数据
export function getTourList() {
  return request({
    url: '/tour',
    method: 'get'
  })
}
