import React, { Component } from 'react'
import { Input, Form, Modal, message } from 'antd'
import { inject, observer } from 'mobx-react'
const FormItem = Form.Item

@inject('hostStore')
@observer
class Add extends Component {
  constructor(props) {
    super(props)
    this.store = props.hostStore
  }

  handleSubmit = () => {
    const { form, onClose } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        try {
          const msg = this.store.setPwd(values.password)
          if (msg) {
            return message.error(msg)
          }
          onClose && onClose()
        } catch (err) {
          console.log(err)
        }
      }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='系统密码'
        visible={true}
        width={500}
        onCancel={this.props.onClose}
        onOk={this.handleSubmit}>
        <Form>
          <FormItem label='密码（sudo）' {...formItemLayout}>
            {getFieldDecorator('password', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入sudo密码'
                }
              ]
            })(<Input type='password' placeholder='请输入sudo密码' />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(Add)
