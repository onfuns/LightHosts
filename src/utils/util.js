const electron = global.require('electron')
export const { remote } = electron
export const { BrowserWindow } = remote

export const createNewWindow = (options = {}) => {
  const win = new BrowserWindow({
    webPreferences: { webSecurity: false },
    height: 600,
    width: 1100,
    frame: false,
    resizable: false,
    ...options
  })
  const { path = '', destroy = true } = options
  win.loadURL(`file://${__dirname}/index.html#${path}`)
  if (destroy) {
    const wins = BrowserWindow.getAllWindows()
    wins.length > 1 && wins[1].destroy()
  }
  return win
}

export const saveCache = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getCache = key => {
  return JSON.parse(localStorage.getItem(key))
}

export const clearCacheByKey = key => {
  localStorage.removeItem(key)
}

export const debounce = (callback, delay) => {
  let timeId = null
  return function() {
    timeId && clearTimeout(timeId)
    timeId = setTimeout(callback, delay)
  }
}

export const needPwd = str => {
  str = str.toLowerCase()
  let keys = [
    'Permission denied',
    'incorrect password',
    'Password:Sorry, try again.'
  ]
  return !!keys.find(k => str.includes(k.toLowerCase()))
}

export const isWin = process.platform === 'win32'
