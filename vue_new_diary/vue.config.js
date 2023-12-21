const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
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
