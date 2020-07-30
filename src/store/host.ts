import { observable, action, toJS } from 'mobx'
import shortid from 'shortid'
import Bluebird from 'bluebird'
import { formatPasswordMesaage, debounce } from '../helper/util'
const execSync = require('child_process').execSync
const storage = Bluebird.promisifyAll(require('electron-json-storage'))
const fs = Bluebird.promisifyAll(require('fs'))

const isWin = process.env.OS === 'win32'
const HOST_PATH = isWin
  ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  : '/etc/hosts'
const FILE_PATH = (process.env.HOMEPATH || process.env.HOME) + '/.LightHosts'
const FILE_NAME = 'HOST_FILE'
storage.setDataPath(FILE_PATH)

interface HostProps {
  id: string
  name: string
  enable: boolean
  data: string
  readOnly: boolean
}

class Menu {
  constructor() {
    this.init()
  }

  init = async () => {
    try {
      let { list = [] }: { list: Array<HostProps> } = await storage.getAsync(
        FILE_NAME
      )
      if (!list.length) {
        fs.readFile(HOST_PATH, 'utf-8', async (err: any, data: string) => {
          if (err) return console.log(`读取host文件失败：\n`, err)
          list = [
            {
              id: shortid.generate(),
              name: '系统HOSTS',
              enable: true, //系统host默认开启
              data,
              readOnly: true //系统host只读
            }
          ]
          await storage.setAsync(FILE_NAME, { list })
        })
      }
      this.hostList = list
      this.currentSelect = list[0]
    } catch (err) {
      console.log(`初始化host文件失败：\n`, err)
    }
  }

  @observable hostList: HostProps[] = []
  @observable currentSelect = <HostProps>{}
  @observable showAddMdoal: boolean = false
  @observable showPwdModal: boolean = false

  @action
  //添加方案
  add = async ({ name }) => {
    try {
      let { list }: { list: Array<HostProps> } = await storage.getAsync(
        FILE_NAME
      )
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
      console.log(`添加host方案失败：\n`, err)
    }
  }

  //更新方案
  update = ({
    flag,
    data,
    type,
    name = '',
    id = ''
  }: {
    flag: boolean
    data?: any
    type: string
    name?: string
    id: string
  }) => {
    const cur_id = id || toJS(this.currentSelect).id
    const list = this.hostList
    const index = list.findIndex(item => item.id === cur_id)
    let isWriteSystemHost = true //是否写入系统host
    if (type === 'host') {
      list[index].data = data
      if (!list[index].enable) {
        isWriteSystemHost = false
      }
    } else if (type === 'menu') {
      list[index].enable = flag
    } else if (type === 'name') {
      list[index].name = name
      isWriteSystemHost = false
    }
    this.hostList = list
    debounce(
      storage.set(FILE_NAME, { list }, () => {
        if (isWriteSystemHost) {
          const data = this.getEnableData(this.hostList)
          this.write(data)
        }
      }),
      500
    )()
    return this.hostList
  }

  //写入host
  write = data => {
    try {
      fs.writeFile(HOST_PATH, data, err => {
        if (isWin) {
          alert('请使用管理员模式运行')
        } else if (!isWin && err && formatPasswordMesaage(err.message)) {
          this.setPwdModal(true)
        }
      })
    } catch (err) {
      console.log(`写入host文件失败：\n`, err)
    }
  }

  //删除方案
  delete = id => {
    const index = this.hostList.findIndex(item => item.id === id)
    //如果删除的是当前选中则上移一位
    if (id === this.currentSelect.id) {
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
    return list
      .filter(l => !!l.enable)
      .reduce((p, c) => {
        return (p.data || p) + '\n\n' + c.data
      })
  }

  //启用方案
  enable = async (id, flag: boolean) => {
    try {
      const list = this.update({ id, flag, type: 'menu' })
      const data = this.getEnableData(list)
      this.write(data)
    } catch (err) {
      console.log(`启用host方案失败：\n`, err)
    }
  }

  //设置添加 & 编辑 弹层
  setAddModal = (flag: boolean) => {
    this.showAddMdoal = flag
  }

  //设置密码弹层
  setPwdModal = (flag: boolean) => {
    this.showPwdModal = flag
  }

  //设置密码
  setPwd = (pwd: string) => {
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
