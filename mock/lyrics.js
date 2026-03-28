const lyricsList = require('../src/assets/data/lyrics.json') // 歌词列表数据文件

module.exports = [
  // 根据id获取歌词
  {
    url: '/lyrics',
    type: 'get',
    response: config => {
      // 重点：有些 Mock 框架会将 query 参数放在 config.query 中，
      // 且拿到的 id 往往是字符串类型 '24'
      const { id } = config.query

      if (!id) return { code: 400, message: 'ID missing' }

      // 使用 隐式转换 或者 统一转为数字进行 find
      const lyric = lyricsList.find(item => Number(item.id) === Number(id))

      if (!lyric) {
        return { code: 404, message: 'Song not found' }
      }

      return {
        code: 20000,
        data: lyric
      }
    }
  }
]
