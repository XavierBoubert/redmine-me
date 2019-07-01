/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const { Menu, Tray, app } = require('electron');
// const FlyoutWin = require('../flyout/flyout-win');

const appPath = app.getPath('userData');
// const trayImagePath = path.join(appPath, 'tray.png');

let tray = null;
// let flyoutWin = null;

const trayIcon = off => path.resolve(__dirname, process.platform === 'darwin'
  ? `assets/icon-darwin${off ? '-off' : ''}.png` : `assets/icon${off ? '-off' : ''}.png`);

module.exports = (group) => {
  if (tray) {
    return tray;
  }

  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath);
  }

  tray = new Tray(trayIcon(false));

  let panelWin = group.create('panel/panel', 'tray-panel');
  let panelParentWin = group.create('panel/panel-parent', 'tray-panel-parent');

  // if (!flyoutWin) {
  //   flyoutWin = new FlyoutWin();
  //   flyoutWin.onIdImageChange((src) => {
  //     if (!src) {
  //       tray.setImage(trayIcon(false));

  //       return;
  //     }

  //     fs.writeFileSync(trayImagePath, src, 'base64');
  //     tray.setImage(trayImagePath);
  //   });
  // }

  const activate = () => {
    panelWin.toggleOpenClose();
    panelParentWin.toggleOpenClose();
  };

  tray.on('click', activate);

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Open/Close',
    click() {
      activate();
    },
  }, {
    label: 'Quit',
    click() {
      tray.destroy();
      group.destroy();

      panelWin = null;
      panelParentWin = null;

      app.quit();
    },
  }]);

  tray.setContextMenu(contextMenu);

  tray.activateAction = activate;

  return tray;
};
