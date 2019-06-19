const path = require('path');
const PerfectPanelWin = require('../perfect-panel/perfect-panel-win');

const panelParentWin = new PerfectPanelWin({
  route: '/panel-parent',
  debug: true,
  window: {
    icon: path.join(__dirname, 'assets/icon.png'),
    width: 250,
    height: 250,
  },
});

module.exports = panelParentWin;
