const HNHData = require('../src/assets/data/charts/albums/hnh.json') // 引入专辑图表JSON文件
const DNDData = require('../src/assets/data/charts/albums/dnd.json')
const DCPData = require('../src/assets/data/charts/albums/dcp.json')
const singlesData = require('../src/assets/data/charts/singles.json') // 单曲数据
const accountsData = require('../src/assets/data/charts/accounts.json') // 账号数据

module.exports = [
  {
    url: '/charts/albums/hnh',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: HNHData.length,
          items: HNHData
        }
      }
    }
  },
  {
    url: '/charts/albums/dnd',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: DNDData.length,
          items: DNDData
        }
      }
    }
  },
  {
    url: '/charts/albums/dcp',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: DCPData.length,
          items: DCPData
        }
      }
    }
  },
  {
    url: '/charts/singles',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: singlesData.length,
          items: singlesData
        }
      }
    }
  },
  {
    url: '/charts/accounts',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: accountsData.length,
          items: accountsData
        }
      }
    }
  }
]
