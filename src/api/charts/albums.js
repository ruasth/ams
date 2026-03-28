import request from '@/utils/request'

// 获取专辑图表数据
export function gethnh() {
  return request({
    url: `/albums/hnh`,
    method: 'get'
  })
}
export function getdnd() {
  return request({
    url: `/albums/dnd`,
    method: 'get'
  })
}
export function getdcp() {
  return request({
    url: `/albums/dcp`,
    method: 'get'
  })
}
