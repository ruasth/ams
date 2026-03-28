const fs = require('fs') // Node自带 读取文件的工具
const path = require('path') // Node自带 处理文件路径的工具

// ========== 从环境变量里读取配置，不用手动写死 ==========
// process.env 是Node.js的语法，用来读取环境变量文件里的变量
const BASE_API = process.env.VUE_APP_BASE_API // 拿到 /avamax-music-station/api
const IS_MOCK = process.env.VUE_APP_MOCK === 'true' // 拿到是否开启Mock

// 只有开启Mock时，才执行注册逻辑
if (IS_MOCK) {
  module.exports = function(app) {
    console.log('\nMock已开启 开始自动注册接口 ↓↓↓')
    // 读取mock文件夹下所有的.js文件
    fs.readdirSync(__dirname).forEach(file => {
      // 只处理.js文件，排除index.js自己
      if (file.endsWith('.js') && file !== 'index.js') {
        // 自动引入接口文件
        const apiList = require(path.join(__dirname, file))
        // 自动遍历所有接口
        apiList.forEach(item => {
          // 拼接完整的接口地址：
          // /avamax-music-station/api + /releases/list =
          // /avamax-music-station/api/releases/list
          const fullUrl = BASE_API + item.url
          // 请求方式转小写，兼容GET/POST
          const method = (item.type || 'get').toLowerCase()

          // 自动注册接口
          app[method](fullUrl, (req, res) => {
            // 调用返回数据逻辑，拿到模拟数据
            const result = item.response(req)
            // 模拟网络延迟）
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
  // 关闭Mock时，什么都不做
  module.exports = function() {}
  console.log('\n Mock已关闭\n')
}
