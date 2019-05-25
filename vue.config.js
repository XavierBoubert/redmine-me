module.exports = {
  publicPath: process.env.LOCAL === 'true' ? '/' : `${process.cwd()}/dist/`,
  css: { extract: false },
  configureWebpack: {
    resolve: {
      symlinks: false,
    },
  },
};
