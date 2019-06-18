const { app, Menu, shell } = require('electron')
const { __DEV__ } = require('./util')

export const defaultMenu = [
  {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        role: 'undo'
      },
      {
        label: '重做',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: '剪切',
        role: 'cut'
      },
      {
        label: '复制',
        role: 'copy'
      },
      {
        label: '粘贴',
        role: 'paste'
      },
      {
        label: '删除',
        role: 'delete'
      },
      {
        label: '全选',
        role: 'selectall'
      }
    ]
  },
  {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: '关于',
        click() {
          shell.openExternal(
            'https://github.com/onfuns/LightHosts'
          )
        }
      }
    ]
  }
]

if (__DEV__) {
  defaultMenu[0].submenu.push({
    label: '开发者工具',
    role: 'toggledevtools'
  })
}

if (process.platform === 'darwin') {
  defaultMenu.unshift({
    label: app.getName(),
    submenu: [
      {
        label: '退出',
        role: 'quit'
      }
    ]
  })
}

const setMenu = (options = []) => {
  let menus = [...defaultMenu, ...options]
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}

module.exports = {
  setMenu
}
