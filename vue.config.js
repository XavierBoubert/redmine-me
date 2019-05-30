module.exports = {
  // publicPath: process.env.LOCAL === 'true' ? '/' : `${process.cwd()}/dist/`,
  publicPath: process.env.LOCAL === 'true' ? '/' : './',
  configureWebpack: {
    resolve: {
      symlinks: false,
    },
    target: 'electron-renderer',
  },
};
