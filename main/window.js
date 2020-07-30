const { BrowserWindow } = require('electron')

const createWindow = (options = {}) => {
  return new BrowserWindow({
    webPreferences: { webSecurity: false, nodeIntegration: true },
    width: 1000,
    height: 800,
    resizable: false,
    show: false,
    ...options
  })
}

module.exports = {
  createWindow
}
