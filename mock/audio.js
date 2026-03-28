const audioList = require('../src/assets/data/audioList.json') // 歌曲音频数据文件

module.exports = [
  // 获取全部歌曲音频列表
  {
    url: '/audio/list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: audioList.length,
          items: audioList
        }
      }
    }
  },
  // 获取单首歌曲音频
  {
    url: '/audio',
    type: 'get',
    response: config => {
      const { id } = config.query
      if (!id) return { code: 400, message: 'ID missing' }
      const audio = audioList.find(item => Number(item.id) === Number(id))
      if (!audio) {
        return { code: 404, message: 'Song not found' }
      }
      return {
        code: 20000,
        data: audio
      }
    }
  }
]
