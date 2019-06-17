/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const { app } = require('electron');

// When the Squirrel installer starts, it starts the app multiple times.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();

  return;
}

if (!app.requestSingleInstanceLock()) {
  app.quit();

  return;
}

const createTray = require('../tray');

let tray = null;

// Used to autoplay audios & videos without the user consent
app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');

// The user tried to run a second instance
app.on('second-instance', () => {
  if (!tray) {
    return;
  }

  tray.activateAction();
});

const startTray = () => {
  if (tray) {
    tray.activateAction();

    return;
  }

  tray = createTray();
};

app.on('ready', () => {
  if (process.platform === 'linux') {
    setTimeout(() => startTray(), 1000);
  } else {
    startTray();
  }
});

// If we don't subscribe to this event, Electron tries to quit
// when the last window closed
app.on('window-all-closed', () => { });

app.on('activate', () => startTray());
