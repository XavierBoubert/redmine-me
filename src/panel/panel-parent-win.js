const path = require('path');
const PerfectPanelWin = require('../perfect-panel/perfect-panel-win');

module.exports = () => new PerfectPanelWin({
  route: '/panel-parent',
  debug: true,
  window: {
    icon: path.join(__dirname, 'assets/icon.png'),
    width: 250,
    height: 250,
  },
});
