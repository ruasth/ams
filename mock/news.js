const newsList = require('../src/assets/data/news/newsList.json')
const newsInfo = require('../src/assets/data/news/newsInfo.json')

module.exports = [
  // 获取新闻列表
  {
    url: '/news/list', // 接口地址
    type: 'get', // 请求方法
    response: config => {
      // console.log(config)

      // 模拟搜索过滤逻辑
      return {
        code: 20000, // 业务状态吗
        data: { // 业务数据
          total: newsList.length, // 数据总数
          items: newsList // 数据列表
        }
      }
    }
  },
  // 获取新闻详情
  {
    url: '/news/info',
    type: 'get',
    response: config => {
      const { id } = config.query

      if (!id) return { code: 400, message: 'ID missing' }

      const song = newsInfo.find(item => Number(item.id) === Number(id))

      if (!song) {
        return { code: 404, message: 'News not found' }
      }

      return {
        code: 20000,
        data: song
      }
    }
  }
]

