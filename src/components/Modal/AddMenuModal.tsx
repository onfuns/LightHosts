import * as React from 'react'
import { Input, Form, Modal, message } from 'antd'
import { inject, observer } from 'mobx-react'
const FormItem = Form.Item
interface DetailProps {
  id?: string
  name?: string
}
interface AddProps {
  onClose: () => void
  hostStore?: any
  visible: boolean
  detail: DetailProps
}

const Add = observer(
  ({
    onClose,
    visible = false,
    hostStore,
    detail: { id = '', name = '' }
  }: AddProps) => {
    const [form] = Form.useForm()
    const onOK = async () => {
      const { hostName } = await form.validateFields()
      try {
        const { hostList, update, add } = hostStore
        if (hostList.includes(hostName)) {
          return message.warn('方案名重复')
        }
        if (id) {
          await update({ id, name: hostName, type: 'name' })
        } else {
          await add({ name: hostName })
        }
        message.success(`操作成功`)
        onClose()
      } catch (err) {
        message.error(`操作失败`)
      }
    }

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    const modalProps = {
      title: 'host方案',
      visible: visible,
      width: 450,
      onCancel: onClose,
      onOk: onOK
    }
    return (
      <Modal {...modalProps} getContainer={false}>
        <Form form={form} initialValues={{ hostName: name }}>
          <FormItem
            label='方案名称'
            name='hostName'
            {...formItemLayout}
            rules={[
              {
                required: true,
                min: 2,
                max: 10,
                message: '名称由2 ~ 10个字符组成'
              }
            ]}>
            <Input placeholder='名称由2 ~ 10个字符组成' />
          </FormItem>
        </Form>
      </Modal>
    )
  }
)

export default inject('hostStore')(Add)
