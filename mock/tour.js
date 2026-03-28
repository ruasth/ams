const tourList = require('../src/data/tour.json')

module.exports = [
  {
    url: '/tour',
    type: 'get',
    response: config => {
      if (!tourList) return { code: 400, message: 'ID missing' }
      return {
        code: 20000,
        data: {
          total: tourList.length,
          tourList
        }
      }
    }
  }
]
