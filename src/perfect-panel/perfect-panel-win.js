/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const electron = require('electron');

const { BrowserWindow, ipcMain, shell } = electron;

const browserUrl = route => (process.env.LOCAL === 'true'
  ? `http://localhost:9005/#${route}`
  : `file://${path.resolve(__dirname)}/../../dist/index.html#${route}`);

class PerfectPanelWin {
  constructor(options) {
    this.options = options;
    this.fixedSize = {
      width: this.options.window.width || 250,
      height: this.options.window.height || 250,
    };

    this.drag = {
      activated: false,
      origin: {
        size: null,
        position: null,
      },
    };
    this.win = null;

    this.onMoveBinded = this.onMove.bind(this);

    // ipcMain.on('renderer:ready', this.rendererReady.bind(this));

    ipcMain.on('browser:open', (event, { url }) => shell.openExternal(url));
    ipcMain.on('devtools:open', () => this.win.webContents.openDevTools({ mode: 'detach' }));
    ipcMain.on('renderer:dragging:start', () => this.startDragging());
    ipcMain.on('renderer:dragging:stop', () => this.stopDragging());
  }

  changeGroup(group) {
    this.group = group;
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
        title: '',
        width: this.fixedSize.width,
        height: this.fixedSize.height,
        acceptFirstMouse: true,
        transparent: true,
        frame: false,
        resizable: true,
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
        ...this.options.window,
      });

      this.win.removeMenu();

      if (this.options.debug) {
        this.win.webContents.openDevTools({
          mode: 'detach',
        });
      }

      this.win.setAlwaysOnTop(true, 'floating', 1);

      this.win.loadURL(browserUrl(this.options.route));

      this.win.webContents.on('dom-ready', () => resolve());
    });
  }

  size(newSize) {
    if (newSize) {
      this.fixedSize = newSize;
      this.win.setMinimumSize(newSize.width, newSize.height);
      this.win.setSize(newSize.width, newSize.height, false);

      return newSize;
    }

    const [width, height] = this.win.getSize();

    return { width, height };
  }

  position(newPosition) {
    if (newPosition) {
      this.win.setBounds({
        x: newPosition.x,
        y: newPosition.y,
        width: this.fixedSize.width,
        height: this.fixedSize.height,
      });

      return newPosition;
    }

    const [x, y] = this.win.getPosition();

    return { x, y };
  }

  onMove() {
    console.log('MOVE', this.position());
  }

  startDragging() {
    this.win.on('move', this.onMoveBinded);
  }

  stopDragging() {
    this.win.removeListener('move', this.onMoveBinded);
  }
}

module.exports = PerfectPanelWin;
