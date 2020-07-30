import React, { useEffect, useRef, useCallback } from 'react'
import { LockOutlined } from '@ant-design/icons'
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/shell/shell'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import './host.less'

let editoreInstance = null
const Hosts = observer(props => {
  const { hostStore } = props
  const textAreaRef = useRef()

  const getSelected = () => {
    const { currentSelect = {} } = hostStore
    return toJS(currentSelect)
  }

  const onTextAreaChange = editor => {
    const value = editor.getValue()
    hostStore.update({ data: value, type: 'host' })
  }

  const onGutterClick = (cm, n) => {
    const { readOnly } = getSelected()
    //只读状态不做处理
    if (!!readOnly) return
    const { text, line } = cm.lineInfo(n)
    if (/^\s*$/.test(text)) return
    let new_ln = /^#/.test(text) ? text.replace(/^#\s*/, '') : '# ' + text
    editoreInstance.getDoc().replaceRange(
      new_ln,
      { line, ch: 0 },
      {
        line,
        ch: text.length
      }
    )
  }

  useEffect(() => {
    const editorConfig = {
      className: 'custom-editor',
      lineNumbers: true,
      mode: 'shell',
      theme: 'idea'
    }
    editoreInstance = CodeMirror.fromTextArea(textAreaRef.current, editorConfig)
    editoreInstance.on('change', onTextAreaChange)
    editoreInstance.on('gutterClick', onGutterClick)
    return () => {
      editoreInstance = null
    }
  }, [])

  useEffect(() => {
    const { data: textAreaData = '', readOnly = false } = getSelected()
    if (editoreInstance) {
      let doc = editoreInstance.getDoc()
      if (textAreaData !== doc.getValue()) {
        doc.setValue(textAreaData)
        doc.setCursor(doc.getCursor())
        editoreInstance.setOption('readOnly', readOnly)
      }
    }
  })

  const { readOnly } = getSelected()

  return (
    <div className='lay-host'>
      {!!readOnly && <LockOutlined className='host-readonly' />}
      <textarea ref={textAreaRef}></textarea>
    </div>
  )
})

export default inject('hostStore')(Hosts)
