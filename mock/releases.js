const releasesData = require('../src/assets/data/releases.json') // 歌曲列表数据文件
const songsData = require('../src/assets/data/songsinfo.json') // 歌曲简介数据文件

module.exports = [
  // 获取全部歌曲列表
  {
    url: '/releases/list', // 只写业务路径，前缀自动拼接
    type: 'get', // 请求方法
    response: config => {
      return {
        code: 20000, // 业务状态码
        data: { // 业务数据
          total: releasesData.length, // 数据总数
          items: releasesData // 数据列表
        }
      }
    }
  },

  // 根据id获取歌曲详情简介
  {
    url: '/releases/detail',
    type: 'get',
    // releases.js 建议修改部分
    response: config => {
      // 重点：有些 Mock 框架会将 query 参数放在 config.query 中，
      // 且拿到的 id 往往是字符串类型 '24'
      const { id } = config.query

      if (!id) return { code: 400, message: 'ID missing' }

      const song = songsData.find(item => Number(item.id) === Number(id))

      if (!song) {
        return { code: 404, message: 'Song not found' }
      }

      return {
        code: 20000,
        data: song
      }
    }
  }
]
