import { observable, action, toJS } from 'mobx'
import shortid from 'shortid'
import Bluebird from 'bluebird'
import { formatPasswordMesaage, debounce } from '../helper/util'
import { HostProps } from '../interface/host.interface'
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

class Menu {
  constructor() {
    this.init()
  }

  initParams = (
    name = '',
    enable = false,
    data = '',
    readOnly = false
  ): HostProps => {
    return {
      id: shortid.generate(),
      name,
      enable,
      data,
      readOnly
    }
  }

  init = async () => {
    try {
      let { list = [] }: { list: Array<HostProps> } = await storage.getAsync(
        FILE_NAME
      )
      if (!list.length) {
        fs.readFile(HOST_PATH, 'utf-8', async (err: any, data: string) => {
          if (err) return console.log(`读取host文件失败：\n`, err)
          //系统host默认开启且只读
          list.push(this.initParams('系统HOST', true, data, true))
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
  @observable passwordModalVisible: boolean = false

  @action
  //添加方案
  add = async ({ name }) => {
    try {
      let { list }: { list: Array<HostProps> } = await storage.getAsync(
        FILE_NAME
      )
      list.push(this.initParams(name, false, `# ${name} 方案\n`, false))
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
    flag?: boolean
    data?: any
    type: string
    name?: string
    id?: string
  }) => {
    const cur_id = id || toJS(this.currentSelect).id
    const list = this.hostList
    const current = list.find(item => item.id === cur_id)
    if (!current) return
    let writeHost = false //是否写入系统host
    if (type === 'host') {
      current.data = data
      //如果不是在启动状态下修改host，则不用同步到系统host中
      writeHost = !!current.enable
    } else if (type === 'menu') {
      current.enable = flag
      //启动禁用都写入
      writeHost = true
    } else if (type === 'name') {
      current.data = current.data.replace(new RegExp(current.name, 'g'), name)
      current.name = name
    }
    this.hostList = list
    debounce(
      storage.set(FILE_NAME, { list }, () => {
        if (writeHost) {
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
    const index = this.hostList.findIndex(i => i.id === id)
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
    let data = ''
    list.filter(l => !!l.enable).map(p => (data += p.data + '\n\n'))
    return data
  }

  //设置密码弹层
  setPwdModal = (flag: boolean) => {
    this.passwordModalVisible = flag
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
