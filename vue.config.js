module.exports = {
  css:{
    loaderOptions:{
      sass:{

      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        // 别名
        vue$: "vue/dist/vue.esm.js", //加上这一句
      }
    }
  },
  }