const fs = require('fs');
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const Icons = require('unplugin-icons/webpack')
const IconsResolver = require('unplugin-icons/resolver')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  transpileDependencies: true,
  devServer: {
    allowedHosts: ['all'],
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync('./ssl/private.key'),
        cert: fs.readFileSync('./ssl/certificate.crt')
      }
    },
    proxy: {
      '/apis': {
        target: 'https://172.25.191.101:18000',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
      }),
      Components({
        resolvers: [ElementPlusResolver(), IconsResolver({ enabledCollections: ['ep'] })],
      }),
      Icons({
        // 按需自动导入element-plus图标，相比正常用法，图标前缀+"i-ep-"，例：<el-icon><i-ep-Menu /></el-icon>
        autoInstall: true
      }),
      // 用于分析web构建加载的node模块占用体积，如果web加载慢，取消该行注释分析占用情况
      // new BundleAnalyzerPlugin()
    ],
  }
}
