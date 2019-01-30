import React from 'react'
import { Input, Form, Modal, message } from 'antd'
import { inject, observer } from 'mobx-react'
const FormItem = Form.Item

const Add = observer(({ onClose, form, hostStore, detail = {} }) => {
  const handleSubmit = () => {
    form.validateFields(async (err, { name }) => {
      if (!err) {
        try {
          const { id = '' } = detail
          const { hostList, update, add } = hostStore
          if (hostList.includes(name)) {
            return message.error('已有同名文件')
          }
          if (id) {
            await update({ id, name, type: 'name' })
          } else {
            await add({ name })
          }
          message.success(`${id ? '编辑' : '新增'}成功`)
          onClose && onClose()
        } catch (err) {
          console.log(err)
          message.error(`${id ? '编辑' : '新增'}失败`)
        }
      }
    })
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }
  const { getFieldDecorator } = form
  return (
    <Modal
      title="新增Host方案"
      visible={true}
      width={400}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form>
        <FormItem
          label="方案名称"
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: detail.name || '',
            rules: [{ required: true, min: 2, max: 8, message: '名称由2 ~ 8个字符组成' }]
          })(
            <Input placeholder="名称由2 ~ 8个字符组成" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

export default inject('hostStore')(Form.create()(Add))