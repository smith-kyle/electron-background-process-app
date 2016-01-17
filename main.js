'use strict';

const electron = require('electron');
const main = require('electron-process').main;
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

let mainWindow = null;

app.on('ready', function() {
  const backgroundURL = 'file://' + __dirname + '/background.html';
  const backgroundProcessHandler = main.createBackgroundProcess(backgroundURL);
  mainWindow = new BrowserWindow({width: 1280, height: 600});
  backgroundProcessHandler.addWindow(mainWindow);
  mainWindow.loadURL('file://' + __dirname + '/foreground.html');
});
