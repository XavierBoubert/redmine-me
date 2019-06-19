const path = require('path');
const PerfectPanelWin = require('../perfect-panel/perfect-panel-win');

const panelWin = new PerfectPanelWin({
  route: '/panel',
  debug: true,
  window: {
    icon: path.join(__dirname, 'assets/icon.png'),
    width: 250,
    height: 250,
  },
});

module.exports = panelWin;
