/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const { Menu, Tray, app } = require('electron');
const FlyoutWin = require('../flyout/flyout-win');

const appPath = app.getPath('userData');
const trayImagePath = path.join(appPath, 'tray.png');

let tray = null;
let flyoutWin = null;

const trayIcon = off => path.resolve(__dirname, process.platform === 'darwin'
  ? `assets/icon-darwin${off ? '-off' : ''}.png` : `assets/icon${off ? '-off' : ''}.png`);

module.exports = () => {
  if (tray) {
    return tray;
  }

  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath);
  }

  tray = new Tray(trayIcon(false));

  if (!flyoutWin) {
    flyoutWin = new FlyoutWin();
    flyoutWin.onIdImageChange((src) => {
      fs.writeFileSync(trayImagePath, src, 'base64');
      tray.setImage(trayImagePath);
    });
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
