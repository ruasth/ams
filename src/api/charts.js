import request from '@/utils/request'

// 获取专辑图表数据
export function gethnh() {
  return request({
    url: `/charts/albums/hnh`,
    method: 'get'
  })
}
export function getdnd() {
  return request({
    url: `/charts/albums/dnd`,
    method: 'get'
  })
}
export function getdcp() {
  return request({
    url: `/charts/albums/dcp`,
    method: 'get'
  })
}

// 单曲图表数据
export function getSingles() {
  return request({
    url: `/charts/singles`,
    method: 'get'
  })
}

// 账号图表数据
export function getAccounts() {
  return request({
    url: `/charts/accounts`,
    method: 'get'
  })
}
