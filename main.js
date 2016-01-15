'use strict';

const electron = require('electron');
const ipc = require('ipc');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

let mainWindow = null;
let backgroundWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1280, height: 600});

  backgroundWindow = new BrowserWindow();
  // backgroundWindow.hide();

  mainWindow.loadURL('file://' + __dirname + '/foreground/index.html');
  backgroundWindow.loadURL('file://' + __dirname + '/background/background.html');
});

// Pass along payload from main window to browser window
ipc.on('BACKGROUND_START', (event, result) => {
  console.log('Background start');
  backgroundWindow.webContents.send.apply(backgroundWindow.webContents, ['BACKGROUND_START', result]);
});

// Pass along result from background window to main window
ipc.on('BACKGROUND_REPLY', (event, result) => {
  console.log('Background reply');
  mainWindow.webContents.send.apply(mainWindow.webContents, ['BACKGROUND_REPLY', result]);
});
