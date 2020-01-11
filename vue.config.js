// vue.config.js file to be place in the root of your repository
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/' + process.env.CI_PROJECT_NAME + '/' : '/'
}
