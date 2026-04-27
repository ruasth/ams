const path = require('path')
const bodyParser = require('body-parser')
const mockServer = require('./mock/index.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  transpileDependencies: [],
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: 'http://localhost:9528', // 本地调试
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // },
    before: function(app) {
      app.use(bodyParser.json())
      mockServer(app)
    }
  },

  chainWebpack: config => {
    config.plugins.delete('prefetch')

    // lrc文件处理
    config.module
      .rule('raw')
      .test(/\.lrc$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
