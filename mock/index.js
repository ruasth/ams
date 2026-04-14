const fs = require('fs')
//  Node.js自带的 文件系统File System 模块，可以理解为Node环境里用来 读写文件、查看文件夹内容 的工具
const path = require('path')

const BASE_API = process.env.VUE_APP_BASE_API
const IS_MOCK = process.env.VUE_APP_MOCK === 'true' // 是否开启Mock

// 开启Mock时执行注册逻辑
if (IS_MOCK) {
  module.exports = function(app) {
    console.log('\nMock已开启 开始自动注册接口 ↓↓↓')
    // 读取mock文件夹下所有的js文件
    fs.readdirSync(__dirname).forEach(file => {
      // 排除index自己
      if (file.endsWith('.js') && file !== 'index.js') {
        // 自动引入接口文件
        const apiList = require(path.join(__dirname, file))
        // 自动遍历所有接口
        apiList.forEach(item => {
          // 拼接完整的接口地址：
          const fullUrl = BASE_API + item.url
          const method = (item.type || 'get').toLowerCase()

          // 自动注册接口
          app[method](fullUrl, (req, res) => {
            // 调用返回数据逻辑，拿到模拟数据
            const result = item.response(req)
            // 模拟网络延迟
            setTimeout(() => {
              res.json(result)
            }, 200)
          })
          console.log('注册成功：', method.toUpperCase(), fullUrl)
        })
      }
    })
    console.log('Mock注册完成 所有接口已就绪\n')
  }
} else {
  // 关闭Mock
  module.exports = function() {}
  console.log('\n Mock已关闭\n')
}
