const { app } = require('electron')
const { setMenu } = require('./menu')
const { setTray } = require('./tray')
const { createWindow } = require('./window')
const { __DEV__ } = require('./util')
const { rendererPath, rendererDevPath, devtools = {} } = require('./config')

//注意！！: 防止变量被V8回收导致功能不正常，需要在函数体外部创建变量
let win = null
let tray = null

//reload when file modified
__DEV__ && require('electron-reload')(rendererDevPath)

/** init window begin */
const initWindow = () => {
  win = createWindow({ title: app.getName(), width: 800, height: 500 })
  win.loadURL(
    'file://' + `${__DEV__ ? rendererDevPath : rendererPath}/index.html`
  )

  devtools.open && win.webContents.openDevTools({ mode: devtools.mode })
  //set tray
  tray = setTray(win)
  //set menu
  setMenu()
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('close', event => {
    if (app.quitting) {
      win = null
    } else {
      event.preventDefault()
      win.hide()
    }
  })
}
/** init window end */

app.on('ready', initWindow)
app.on('activate', () => {
  win.show()
})
app.on('before-quit', () => {
  app.quitting = true
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
