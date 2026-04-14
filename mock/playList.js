const playList = require('../src/data/playList.json')

module.exports = [
  {
    url: '/playList',
    type: 'get',
    response: config => {
      if (!playList) return { code: 400, message: 'playlist missing' }
      return {
        code: 20000,
        data: {
          total: playList.length,
          playList
        }
      }
    }
  }
]
