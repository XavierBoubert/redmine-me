/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { Menu, Tray, app } = require('electron');
const FlyoutWin = require('../flyout/flyout-win');

let tray = null;
let flyoutWin = null;

const trayIcon = off => path.resolve(__dirname, process.platform === 'darwin'
  ? `assets/icon-darwin${off ? '-off' : ''}.png` : `assets/icon${off ? '-off' : ''}.png`);

module.exports = () => {
  if (tray) {
    return tray;
  }

  tray = new Tray(trayIcon(true));

  if (!flyoutWin) {
    flyoutWin = new FlyoutWin();
  }

  tray.on('click', () => flyoutWin.open());

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Quit',
    click() {
      tray.destroy();
      app.quit();
    },
  }]);

  tray.setContextMenu(contextMenu);

  return tray;
};
