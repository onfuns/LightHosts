const path = require('path')
const join = name => path.join(__dirname, name)

module.exports = {
  trayIcon: join('../resources/icon@16x16.png'),
  rendererPath: join('../renderer_process'),
  rendererDevPath: join('../dist'),
  devtools: {
    open: false,
    mode: 'bottom' // //detach right bottom
  }
}
