module.exports = {
  publicPath: process.env.LOCAL === 'true' ? '/' : `${process.cwd()}/dist/`,
  configureWebpack: {
    resolve: {
      symlinks: false,
    },
    target: 'electron-renderer',
  },
};
