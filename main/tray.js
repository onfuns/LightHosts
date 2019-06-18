const { app, Menu, Tray } = require('electron')
const path = require('path')
const { trayIcon } = require('./config')

const setTray = (win, options = []) => {
  let tray = new Tray(path.join(__dirname, '../', trayIcon))
  const trayMemu = [
    {
      label: app.getName(),
      click() {
        win.show()
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click() {
        app.quit()
      }
    },
    ...options
  ]
  const contextMenu = Menu.buildFromTemplate(trayMemu)
  tray.setContextMenu(contextMenu)
  tray.setToolTip(app.getName())
  return tray
}

module.exports = {
  setTray
}
