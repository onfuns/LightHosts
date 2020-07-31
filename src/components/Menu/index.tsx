import React, { useEffect, useState } from 'react'
import AddMenuModal from '../Modal/AddMenuModal'
import InputPasswordModal from '../Modal/InputPasswordModal'
import { Switch, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import classnames from 'classnames'
import { HostProps } from '../../interface/host.interface'
import './menu.less'

interface ContextmenuProps {
  visible: boolean
  x: number
  y: number
}

const Menu = observer(props => {
  const { hostStore } = props
  const defaultContextmenu: ContextmenuProps = {
    visible: false,
    x: 0,
    y: 0
  }
  const [contextmenu, setContextmenu] = useState(defaultContextmenu)
  const [addMenuModalProps, setAddMenuModalProps] = useState({
    type: 'add',
    visible: false
  })

  const onDocumentClick = () => {
    setContextmenu({ ...contextmenu, visible: false })
  }

  useEffect(() => {
    document.addEventListener('click', onDocumentClick)
    return () => {
      document.removeEventListener('click', onDocumentClick)
    }
  }, [])

  const onSelect = (record: HostProps) => {
    hostStore.select(record)
  }

  const onEnable = (id: string, flag: boolean) => {
    hostStore.update({ id, flag, type: 'menu' })
  }

  const onEdit = (type: string, flag = true) => {
    setAddMenuModalProps({ type, visible: flag })
  }

  const onDelete = () => {
    const {
      currentSelect: { id, name }
    } = hostStore
    Modal.confirm({
      title: `确定删除『${name}』方案？`,
      okType: 'danger',
      onOk: () => {
        hostStore.delete(id)
        message.success('删除成功')
      }
    })
  }

  const closeAddModal = () => {
    setAddMenuModalProps({ ...addMenuModalProps, visible: false })
  }

  const closePwdModal = () => {
    hostStore.setPwdModal(false)
  }

  const onContextMenu = (e, record: HostProps) => {
    e.persist()
    if (record.readOnly) return
    let x = e.clientX + 10
    //溢出边界处理
    x = x + 70 > 200 ? x - 90 : x
    setContextmenu({
      ...contextmenu,
      visible: true,
      x,
      y: e.clientY + 10
    })
    onSelect(record)
  }

  const {
    hostList,
    currentSelect: { id, name },
    passwordModalVisible
  } = hostStore
  const { visible: contextmenuVisible, x, y } = contextmenu

  return (
    <div className='lay-menu'>
      {hostList.map((h: HostProps) => (
        <div
          className={classnames('lay-menu-item', {
            'menu-active': name === h.name
          })}
          onClick={() => onSelect(h)}
          onContextMenu={e => onContextMenu(e, h)}
          key={h.id}>
          <span>{h.name}</span>
          {!h.readOnly && (
            <Switch
              className='menu-switch'
              size='small'
              onChange={value => onEnable(h.id, value)}
              defaultChecked={h.enable}
            />
          )}
        </div>
      ))}
      <div className='menu-footer-tools'>
        <PlusOutlined onClick={() => onEdit('add')} className='menu-add' />
      </div>
      {/* 右键菜单 */
      contextmenuVisible ? (
        <div className='context-menu' style={{ left: x, top: y }}>
          <span onClick={() => onEdit('edit')}>编辑</span>
          <span onClick={onDelete}>删除</span>
        </div>
      ) : null}
      {/* 添加 & 编辑弹层 */
      addMenuModalProps.visible && (
        <AddMenuModal
          onClose={closeAddModal}
          visible={addMenuModalProps.visible}
          detail={addMenuModalProps.type === 'edit' ? { id, name } : {}}
        />
      )}
      {/* 设置密码弹层 */
      passwordModalVisible && (
        <InputPasswordModal
          onClose={closePwdModal}
          visible={passwordModalVisible}
        />
      )}
    </div>
  )
})

export default inject('hostStore')(Menu)
