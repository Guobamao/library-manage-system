const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
})

