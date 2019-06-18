import React, { Component } from 'react'
import AddMenuModal from '../components/AddMenuModal'
import PwdModal from '../components/PwdModal'
import { Icon, Switch, Modal, message } from 'antd'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import './menu.less'

@inject('hostStore')
@observer
class Menu extends Component {

  constructor(props) {
    super(props)
    this.store = props.hostStore
    this.state = {
      contextmenu: { //右键菜单配置
        visible: false,
        x: 0,
        y: 0,
        detail: {} //记录当前右键点击的方案
      }
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick)
  }

  onDocumentClick = () => {
    let { contextmenu } = this.state
    contextmenu.visible = false
    this.setState({ contextmenu })
  }

  onSelect = (item) => {
    this.store.select(item)
  }

  onEnable = ({ id }, flag) => {
    this.store.enable(id, flag)
  }

  edit = () => {
    this.store.setAddModal(true)
  }

  delete = () => {
    const { contextmenu: { detail: { name, id } } } = this.state
    Modal.confirm({
      title: `确认删除『${name}』方案？`,
      okType: 'danger',
      onOk: () => {
        this.store.delete(id)
        message.success('删除成功')
      }
    })
  }

  closeAddModal = () => {
    let { contextmenu } = this.state
    contextmenu.detail = {}
    this.setState({ contextmenu }, this.store.setAddModal(false))
  }

  closePwdModal = () => {
    this.store.setPwdModal(false)
  }

  onContextMenu = (e, detail) => {
    e.persist()
    if (detail.readOnly) return
    let x = e.clientX + 10
    if (x + 70 > 200) {
      x = x - 90
    }
    this.setState({
      contextmenu: {
        visible: true,
        x,
        y: e.clientY + 10,
        detail
      }
    })
  }

  render() {
    const { hostList, currentSelect, showPwdModal, showAddMdoal } = this.store
    const { name: selectedName } = toJS(currentSelect)
    const { contextmenu: { visible, x, y, detail } } = this.state
    return (
      <div className="lay-menu">
        {
          hostList.map(item => (
            <div
              className={`lay-menu-item ${selectedName === item.name && 'menu-active'}`}
              onClick={() => this.onSelect(item)}
              onContextMenu={(e) => this.onContextMenu(e, item)}
              key={item.id}
            >
              <span>{item.name}</span>
              <div className="menu-tools">
                {
                  item.readOnly ? null :
                    <Switch
                      className="menu-switch"
                      onChange={(value) => this.onEnable(item, value)}
                      defaultChecked={item.enable}
                    />
                }
              </div>
            </div>
          ))
        }
        <div className="menu-footer-tools">
          <Icon type="plus" onClick={this.edit} />
        </div>
        {/* 右键菜单 */}
        {visible ?
          <div
            className="context-menu"
            style={{ left: x, top: y }}
          >
            <span onClick={this.edit}>编辑</span>
            <span onClick={this.delete}>删除</span>
          </div> : null
        }
        {/* 添加 & 编辑弹层 */}
        {
          showAddMdoal ?
            <AddMenuModal
              onClose={this.closeAddModal}
              detail={detail}
            /> : null
        }
        {/* 设置密码弹层 */}
        {
          showPwdModal ?
            <PwdModal onClose={this.closePwdModal} /> : null
        }
      </div>
    )
  }
}

export default Menu