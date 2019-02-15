const electron = require('electron')
const path = require('path')
const { app, Menu, BrowserWindow, Tray } = electron

const isDev = process.env.NODE_ENV == 'development'
if (isDev) {
  require('electron-reload')(__dirname, {
    ignored: /node_modules|src/   //webpack 监听src目录下文件重新编译，这里不用再次监听，否则二次刷新
  })
}

/** 设置菜单*/
function setMenu() {
  let menuTemplate = [
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          role: 'undo'
        }, {
          label: '重做',
          role: 'redo'
        }, {
          type: 'separator'
        }, {
          label: '剪切',
          role: 'cut'
        }, {
          label: '复制',
          role: 'copy'
        }, {
          label: '粘贴',
          role: 'paste'
        }, {
          label: '删除',
          role: 'delete'
        }, {
          label: '全选',
          role: 'selectall'
        }
      ]
    },
    { label: '帮助', role: 'help', submenu: [{ label: '关于', click() { electron.shell.openExternal('https://github.com/onfuns/LightHosts') } }] }
  ]
  if (process.platform === 'darwin') {
    menuTemplate.unshift({
      label: app.getName(),
      submenu: [
        {
          label: '退出',
          role: 'quit'
        }
      ]
    })
  }
  if (!isDev) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
  }
}

/** set tray begin */
let tray = null
function setTray(win) {
  tray = new Tray(path.join(__dirname, './assets/images/lighthosts@16*16.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'LightHosts', click() { win.show() } },
    { type: 'separator' },
    { label: '退出', click() { app.quit() } },
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('LightHosts')
}

/** set tray end */

/** create window begin */
let win = null
function createWindow() {
  win = new BrowserWindow({
    webPreferences: { webSecurity: false },
    width: 700,
    height: 500,
    resizable: false,
    title: "LightHosts",
    show: false
  })
  win.loadURL(isDev ? `file://${__dirname}/dist/index.html` : `file://${__dirname}/index.html`)
  win.once('ready-to-show', () => { win.show() })
  win.on('close', (event) => {
    if (app.quitting) {
      win = null
    } else {
      event.preventDefault()
      win.hide()
    }
  })
  setTray(win)
  setMenu()
}
/** create window end */

app.on('ready', createWindow)

app.on('activate', () => { win.show() })

app.on('before-quit', () => app.quitting = true)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})