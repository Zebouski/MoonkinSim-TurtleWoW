// vue.config.js file to be place in the root of your repository
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/'
}
process.env.VUE_APP_VERSION = require('./package.json').version
