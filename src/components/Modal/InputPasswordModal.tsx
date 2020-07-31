import React from 'react'
import { Input, Form, Modal, message, Button } from 'antd'
import { inject, observer } from 'mobx-react'

const InputPasswordModal = observer(props => {
  const { onClose = () => {}, hostStore, visible } = props
  const [form] = Form.useForm()

  const onOk = async () => {
    try {
      const { password } = await form.validateFields()
      const msg = hostStore.setPwd(password)
      if (msg) {
        return message.error(msg)
      }
      onClose()
    } catch (err) {
      console.log(err)
    }
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const modalProps = {
    title: '系统密码',
    visible: visible,
    width: 500,
    closable: false,
    footer: [
      <Button type='primary' onClick={onOk}>
        确定
      </Button>
    ]
  }

  return (
    <Modal {...modalProps} getContainer={false}>
      <Form form={form}>
        <Form.Item
          label='密码（sudo）'
          name='password'
          {...formItemLayout}
          rules={[{ required: true, message: '请输入sudo密码' }]}>
          <Input type='password' placeholder='请输入sudo密码' />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default inject('hostStore')(InputPasswordModal)
