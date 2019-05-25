/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const { app } = require('electron');
const FlyoutWin = require('../flyout/flyout-win');

let flyoutWin = null;

// Used to autoplay audios & videos without the user consent
app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');

const startFlyout = () => {
  if (flyoutWin) {
    return;
  }

  flyoutWin = new FlyoutWin();
  flyoutWin.open();
};

app.on('ready', () => startFlyout());
