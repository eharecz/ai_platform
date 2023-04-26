const fs = require('fs');
const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync('./ssl/private.key'),
        cert: fs.readFileSync('./ssl/certificate.crt')
      }
    },
    proxy: {
      '/apis': {
        target: 'https://ssdlut314.com:18000',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      }
    }
  }
})
