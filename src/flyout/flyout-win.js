/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const electron = require('electron');
const AutoLaunch = require('auto-launch');

const { BrowserWindow, ipcMain, shell } = electron;
const WIN_URL = process.env.LOCAL === 'true'
  ? 'http://localhost:9005#/flyout'
  : `file://${path.resolve(__dirname)}/../../dist/index.html#/flyout`;
const PANELS = {
  none: { width: (250 + 5), height: 64 },
  activity: { width: 580, height: 350 },
  options: { width: 380, height: 675 },
};

const autoLaunch = new AutoLaunch({ name: 'Redmine me' });

const onIdImageChangeEvents = [];

class FlyoutWin {
  constructor() {
    ipcMain.on('panel:opened', (event, { name, opened }) => {
      const panel = opened ? PANELS[name] : PANELS.none;

      this.win.setMinimumSize(panel.width, panel.height);
      this.win.setSize(panel.width, panel.height);
    });

    ipcMain.on('browser:open', (event, { url }) => shell.openExternal(url));
    ipcMain.on('devtools:open', () => this.win.webContents.openDevTools({ mode: 'detach' }));
    ipcMain.on(
      'options:auto-launch',
      (event, { enable }) => autoLaunch[enable ? 'enable' : 'disable'](),
    );
    ipcMain.on('tray:image', (event, { src }) => onIdImageChangeEvents.forEach(fn => fn(src)));
  }

  // eslint-disable-next-line class-methods-use-this
  onIdImageChange(fn) {
    onIdImageChangeEvents.push(fn);

    return () => onIdImageChangeEvents.splice(onIdImageChangeEvents.indexOf(fn), 1);
  }

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

  toggleOpenClose() {
    this[this.win ? 'close' : 'open']();
  }

  focus() {
    if (!this.win) {
      return;
    }

    if (this.win.isMinimized()) {
      this.win.restore();
    }

    this.win.focus();
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
        icon: path.join(__dirname, 'assets/icon.png'),
        width: 250 + 14,
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
        webSecurity: false,
        webPreferences: {
          nodeIntegration: true,
        },
      });

      this.win.setMenu(null);

      // if (process.env.DEBUG === 'true') {
        this.win.webContents.openDevTools({
          mode: 'detach',
        });
      // }

      this.win.setAlwaysOnTop(true, 'floating', 1);

      this.win.loadURL(WIN_URL);

      this.win.webContents.on('dom-ready', () => resolve());
    });
  }
}

module.exports = FlyoutWin;
