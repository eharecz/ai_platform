const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    proxy: {
      '/apis': {
        target: 'http://ryancode.f3322.net:18000',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      }
    }
  }
})
