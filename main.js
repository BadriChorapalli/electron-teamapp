const {app, BrowserWindow} = require('electron');
const path = require('path')
let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', () => {
 // mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true, contextIsolation: false}});
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
	  nodeIntegration: true, 
	  contextIsolation: false
    }
  })
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
