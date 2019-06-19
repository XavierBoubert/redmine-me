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

    this.drag = {
      activated: false,
      origin: {
        size: null,
      },
    };
    this.win = null;

    ipcMain.on('renderer:ready', this.rendererReady.bind(this));
    ipcMain.on('renderer:drag:toggle', (event, position) => this.dragToggle(position));
    ipcMain.on('renderer:drag:ready', () => this.dragOn(1));

    ipcMain.on('browser:open', (event, { url }) => shell.openExternal(url));
    ipcMain.on('devtools:open', () => this.win.webContents.openDevTools({ mode: 'detach' }));
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
        width: 250,
        height: 250,
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

      this.win.on('move', () => {
        console.log('move', this.position());
      });

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
      this.win.setSize(newSize.width, newSize.height, false);

      return newSize;
    }

    const [width, height] = this.win.getSize();

    return { width, height };
  }

  position(newPosition) {
    if (newPosition) {
      this.win.setPosition(newPosition.x, newPosition.y, false);

      return newPosition;
    }

    const [x, y] = this.win.getPosition();

    return { x, y };
  }

  rendererReady() {
    this.win.webContents.send('main:size', this.size());
  }

  dragOn(step = 0) {
    const displays = electron.screen.getAllDisplays();
    const displaysIds = displays.map(display => display.id);

    const bounds = this.win.getBounds();
    const winScreen = electron.screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });
    const screenIndex = displaysIds.indexOf(winScreen.id);

    if (screenIndex < 0) {
      return;
    }

    if (step === 0) {
      this.drag.origin = { size: this.size() };
      this.win.setMinimumSize(winScreen.workArea.width, winScreen.workArea.height);
      this.win.setSize(winScreen.workArea.width, winScreen.workArea.height, false);
      this.win.webContents.send('main:drag:position', this.position());
    } else if (step === 1) {
      this.win.setPosition(winScreen.workArea.x, winScreen.workArea.y, false);
    }
  }

  dragOff(position) {
    this.win.webContents.send('main:drag:done');
    this.win.setPosition(position.x, position.y, false);
    this.win.setMinimumSize(this.drag.origin.size.width, this.drag.origin.size.height);
    this.win.setSize(this.drag.origin.size.width, this.drag.origin.size.height, false);
  }

  dragToggle(position) {
    this.drag.activated = !this.drag.activated;

    if (this.drag.activated) {
      this.dragOn();
    } else {
      this.dragOff(position);
    }
  }
}

module.exports = PerfectPanelWin;
