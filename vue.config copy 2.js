const path = require('path')
const mockServer = require('./mock/index.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 虚拟mock数据接口
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  transpileDependencies: [],
  devServer: {
    port: 9528,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:9528',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    before: function(app) {
      mockServer(app)
    }
  },

  // webpack配置
  configureWebpack: {
    plugins: [
      // 复制 Cesium 的静态资源到输出目录
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Workers'),
          to: 'cesium/Workers'
        },
        {
          from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Assets'),
          to: 'cesium/Assets'
        },
        {
          from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Widgets'),
          to: 'cesium/Widgets'
        }
      ])
    ],
    module: {
      unknownContextCritical: false, // 避免某些警告
      unknownContextRegExp: /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
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
    // svg作为组件使用
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
    // cesium
    config.plugin('define').tap(args => {
      args[0]['CESIUM_BASE_URL'] = JSON.stringify('/cesium')
      return args
    })
  }
}
