const electron = require('electron')
export const { remote } = electron
export const { BrowserWindow } = remote

export const createNewWindow = (options: any = {}) => {
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
  const val = typeof value === 'string' ? value : JSON.stringify(value)
  localStorage.setItem(key, val)
}

export const getCache = key => {
  const value = localStorage.getItem(key)
  return typeof value === 'string' ? value : JSON.parse(value)
}

export const clearCacheByKey = key => {
  localStorage.removeItem(key)
}

export const debounce = (callback, delay) => {
  let timeId = null
  return () => {
    timeId && clearTimeout(timeId)
    timeId = setTimeout(callback, delay)
  }
}

export const formatPasswordMesaage = str => {
  const keys = [
    'Permission denied',
    'incorrect password',
    'Password:Sorry, try again.'
  ]
  return !!keys.find(k => str.toLowerCase().includes(k.toLowerCase()))
}

export const isWin = process.platform === 'win32'
