const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/vue_new_diary/' : '/',
  transpileDependencies: true,
  devServer : {
    // proxy : {
    //   '/api' : {
    //     target : 'http://mangsteen977.dothome.co.kr/ajax/DB_Test/',
    //     changeOrigin : true,
    //     rewrite : (path) => path.replace(/^\/api/, ''),
    //     secure : false,
    //     ws : true
    //   }
    // }
  }
})