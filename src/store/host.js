import { observable, action, toJS } from 'mobx'
import shortid from 'shortid'
import Bluebird from 'bluebird'
import { needPwd, debounce, isWin } from '../utils/util'
const execSync = require('child_process').execSync
const storage = Bluebird.promisifyAll(require('electron-json-storage'))
const fs = Bluebird.promisifyAll(require('fs'))

const HOST_PATH = isWin
  ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  : '/etc/hosts'
const FILE_PATH =
  (isWin ? process.env.HOMEPATH : process.env.HOME) + '/.LightHosts'
const FILE_NAME = 'HOST_FILE'
storage.setDataPath(FILE_PATH)

class Menu {
  constructor() {
    this.init()
  }

  init = async () => {
    try {
      const { list = [] } = await storage.getAsync(FILE_NAME)
      if (!list.length) {
        fs.readFile(HOST_PATH, 'utf-8', async (err, data) => {
          if (!err) {
            let list = [
              {
                id: shortid.generate(),
                name: '系统HOSTS',
                enable: true,
                data,
                readOnly: true
              }
            ] //系统host默认开启
            await storage.setAsync(FILE_NAME, { list })
            this.hostList = list
            this.currentSelect = list[0]
          } else {
            console.log(err)
          }
        })
      } else {
        this.hostList = list
        this.currentSelect = list[0]
      }
    } catch (error) {
      console.log(error)
    }
  }

  @observable hostList = []
  @observable currentSelect = {}
  @observable showAddMdoal = false
  @observable showPwdModal = false

  @action
  //添加方案
  add = async ({ name }) => {
    try {
      let { list } = await storage.getAsync(FILE_NAME)
      list.push({
        id: shortid.generate(),
        name,
        data: `# ${name} 方案\n`,
        enable: false,
        readOnly: false
      })
      await storage.setAsync(FILE_NAME, { list })
      this.hostList = list
    } catch (err) {
      console.log(err)
    }
  }

  //更新方案
  update = ({ flag, data, type, name = '', id = '' }) => {
    let cur_id = id || toJS(this.currentSelect).id
    let list = this.hostList
    let index = list.findIndex(item => item.id === cur_id)
    let is_write_system_host = true //是否写入系统host
    if (type === 'host') {
      list[index].data = data
      if (!list[index].enable) {
        is_write_system_host = false
      }
    } else if (type === 'menu') {
      list[index].enable = flag
    } else if (type === 'name') {
      list[index].name = name
      is_write_system_host = false
    }
    this.hostList = list
    debounce(
      storage.set(FILE_NAME, { list }, () => {
        if (is_write_system_host) {
          const data = this.getEnableData(this.hostList)
          this.write(data)
        }
      }),
      500
    )()
    return this.hostList
  }

  //写入系统host

  write = data => {
    try {
      fs.writeFile(HOST_PATH, data, err => {
        if (err) {
          if (isWin) {
            alert('请使用管理员模式运行')
          } else if (!isWin && needPwd(err.message)) {
            this.setPwdModal(true)
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  //删除方案
  delete = id => {
    const index = this.hostList.findIndex(item => item.id === id)
    if (id === this.currentSelect.id) {
      //删除的是当前选中
      this.currentSelect = this.hostList[index - 1]
    }
    this.hostList.splice(index, 1)
    debounce(
      storage.set(FILE_NAME, { list: this.hostList }, () => {
        const data = this.getEnableData(this.hostList)
        this.write(data)
      }),
      500
    )()
  }

  //切换方案
  select = item => {
    this.currentSelect = item
  }

  //获取开启的方案
  getEnableData = list => {
    list = list.filter(item => item.enable === true)
    let data = ''
    for (let i in list) {
      data += list[i].data + '\n\n'
    }
    return data
  }

  //启用方案
  enable = async (id, flag) => {
    try {
      const list = this.update({ id, flag, type: 'menu' })
      const data = this.getEnableData(list)
      this.write(data)
    } catch (err) {
      console.log(err)
    }
  }

  //设置添加 & 编辑 弹层
  setAddModal = flag => {
    this.showAddMdoal = flag
  }

  //设置密码弹层
  setPwdModal = flag => {
    this.showPwdModal = flag
  }

  //设置密码
  setPwd = pwd => {
    let msg = ''
    try {
      execSync(`echo '${pwd}' | sudo -S chmod 777 ${HOST_PATH}`)
    } catch (err) {
      msg = '密码不正确'
    }
    return msg
  }
}

export default new Menu()
