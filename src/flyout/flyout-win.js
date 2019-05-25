/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const electron = require('electron');

const { BrowserWindow } = electron;

const winUrl = process.env.LOCAL === 'true'
  ? 'http://localhost:9005/'
  : `file://${process.cwd()}/dist/index.html`;

class FlyoutWin {
  async open() {
    if (this.win && !this.win.isDestroyed()) {
      this.win.show();

      return;
    }

    await this.createWindow();

    await this.show();
  }

  close() {
    if (!this.win) {
      return;
    }

    this.destroyWin();
  }

  show() {
    return new Promise((resolve) => {
      this.win.once('show', () => resolve());
      this.win.show();
    });
  }

  destroyWin() {
    this.win.close();
    this.win = null;
  }

  createWindow() {
    return new Promise((resolve) => {
      if (this.win && !this.win.isDestroyed()) {
        resolve();

        return;
      }

      this.win = new BrowserWindow({
        title: 'Redmine me',
        icon: path.join(__dirname, './assets/logo.png'),
        width: (250 + 14),
        height: 74,
        acceptFirstMouse: true,
        transparent: true,
        frame: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        hasShadow: false,
        skipTaskbar: true,
        show: false,
      });

      this.win.setMenu(null);

      if (process.env.DEBUG === 'true') {
        this.win.webContents.openDevTools({
          mode: 'detach',
        });
      }

      this.win.setAlwaysOnTop(true, 'floating', 1);

      this.win.loadURL(winUrl);

      this.win.webContents.on('dom-ready', () => resolve());
    });
  }
}

module.exports = FlyoutWin;
