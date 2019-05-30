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

const FlyoutWin = require('../flyout/flyout-win');

let flyoutWin = null;

// Used to autoplay audios & videos without the user consent
app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');

// The user tried to run a second instance
app.on('second-instance', () => {
  if (!flyoutWin) {
    return;
  }

  flyoutWin.focus();
});

const startFlyout = () => {
  if (flyoutWin) {
    return;
  }

  flyoutWin = new FlyoutWin();
  flyoutWin.open();
};

app.on('ready', () => startFlyout());

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', startFlyout);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => startFlyout());
