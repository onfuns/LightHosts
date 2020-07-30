import React, { useEffect, useState } from 'react'
import AddMenuModal from '../Modal/AddMenuModal'
import InputPasswordModal from '../Modal/InputPasswordModal'
import { Switch, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import classnames from 'classnames'
import './menu.less'

interface ContextmenuProps {
  visible: boolean
  x: number
  y: number
  detail: any
}

const Menu = observer(props => {
  const { hostStore } = props
  const defaultContextmenu: ContextmenuProps = {
    visible: false,
    x: 0,
    y: 0,
    detail: {} //记录当前右键点击的方案
  }
  const [contextmenu, setContextmenu] = useState(defaultContextmenu)

  const onDocumentClick = () => {
    setContextmenu({ ...contextmenu, visible: false })
  }

  useEffect(() => {
    document.addEventListener('click', onDocumentClick)
    return () => {
      document.removeEventListener('click', onDocumentClick)
    }
  }, [])

  const onSelect = item => {
    hostStore.select(item)
  }

  const onEnable = ({ id }, flag) => {
    hostStore.enable(id, flag)
  }

  const onEdit = () => {
    hostStore.setAddModal(true)
  }

  const onDelete = () => {
    const {
      detail: { name, id }
    } = contextmenu
    Modal.confirm({
      title: `确认删除『${name}』方案？`,
      okType: 'danger',
      onOk: () => {
        hostStore.delete(id)
        message.success('删除成功')
      }
    })
  }

  const closeAddModal = () => {
    setContextmenu({ ...contextmenu, detail: {} })
    hostStore.setAddModal(false)
  }

  const closePwdModal = () => {
    hostStore.setPwdModal(false)
  }

  const onContextMenu = (e, detail) => {
    e.persist()
    if (detail.readOnly) return
    let x = e.clientX + 10
    if (x + 70 > 200) {
      x = x - 90
    }
    setContextmenu({
      ...contextmenu,
      visible: true,
      x,
      y: e.clientY + 10,
      detail
    })
  }
  const { hostList, currentSelect, showPwdModal, showAddMdoal } = hostStore
  const { name: selectedName } = toJS(currentSelect)
  const { visible, x, y, detail } = contextmenu
  return (
    <div className='lay-menu'>
      {hostList.map(item => (
        <div
          className={classnames('lay-menu-item', {
            'menu-active': selectedName === item.name
          })}
          onClick={() => onSelect(item)}
          onContextMenu={e => onContextMenu(e, item)}
          key={item.id}>
          <span>{item.name}</span>
          <div className='menu-tools'>
            {!item.readOnly && (
              <Switch
                className='menu-switch'
                size='small'
                onChange={value => onEnable(item, value)}
                defaultChecked={item.enable}
              />
            )}
          </div>
        </div>
      ))}
      <div className='menu-footer-tools'>
        <PlusOutlined onClick={onEdit} className='menu-add' />
      </div>
      {/* 右键菜单 */
      visible ? (
        <div className='context-menu' style={{ left: x, top: y }}>
          <span onClick={onEdit}>编辑</span>
          <span onClick={onDelete}>删除</span>
        </div>
      ) : null}
      {/* 添加 & 编辑弹层 */
      showAddMdoal && (
        <AddMenuModal
          onClose={closeAddModal}
          visible={showAddMdoal}
          detail={detail}
        />
      )}
      {/* 设置密码弹层 */
      showPwdModal && (
        <InputPasswordModal onClose={closePwdModal} visible={showPwdModal} />
      )}
    </div>
  )
})

export default inject('hostStore')(Menu)
