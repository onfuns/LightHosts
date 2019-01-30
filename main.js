const electron = require('electron')
const { app, ipcMain, Menu, BrowserWindow } = electron

const isDev = process.env.NODE_ENV == 'development'
if (isDev) {
  require('electron-reload')(__dirname, {
    ignored: /node_modules|src/   //webpack 监听src目录下文件重新编译，这里不用再次监听，否则二次刷新
  })
}

const menuTemplate = [
  {
    role: 'editMenu',
  },
  {
    role: 'help',
    submenu: [
      {
        label: '关于',
        click() { electron.shell.openExternal('https://github.com/onfuns/LightHosts') }
      }
    ]
  }
]
//Mac 工具栏
if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
}

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: { webSecurity: false },
    width: 700,
    height: 500,
    //frame: false,
    //transparent: true,
    //titleBarStyle: 'hidden',
    resizable: false,
    title: "LightHosts"
    //alwaysOnTop: 'top'
  });
  //setTimeout(() => mainWindow.setAlwaysOnTop(true), 1000); //置顶窗口

  mainWindow.loadURL(isDev ? `file://${__dirname}/app/build/index.html` : `file://${__dirname}/index.html`)

  if (!isDev) {
    let menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu);
  }
}

app.on('ready', createWindow);
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})
app.on('window-all-closed', () => {
  app.quit()
})