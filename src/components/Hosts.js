import React, { Component } from 'react'
import { Icon } from 'antd'
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/shell/shell'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/idea.css'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import './hosts.less'

@inject('hostStore')
@observer

class Hosts extends Component {
  constructor(props) {
    super(props)
    this.codeMirrorEditor = null
    this.store = props.hostStore
  }

  componentDidMount() {
    this.codeMirrorEditor = CodeMirror.fromTextArea(this.editor, {
      className: 'custom-editor',
      lineNumbers: true,
      mode: "shell",
      theme: 'idea'
    })
    this.codeMirrorEditor.on('change', (editor) => {
      const value = editor.getValue()
      this.store.update({ data: value, type: "host" })
    })

    this.codeMirrorEditor.on('gutterClick', (cm, n) => {
      const { readOnly = false } = this.getRecord()
      //只读状态
      if (readOnly) return
      let info = cm.lineInfo(n)
      let ln = info.text
      if (/^\s*$/.test(ln)) return
      let new_ln = /^#/.test(ln) ? ln.replace(/^#\s*/, '') : '# ' + ln
      this.codeMirrorEditor.getDoc()
        .replaceRange(new_ln, { line: info.line, ch: 0 }, {
          line: info.line,
          ch: ln.length
        })
    })
  }

  getRecord = () => {
    const { currentSelect = {} } = this.store
    return toJS(currentSelect)
  }

  UNSAFE_componentWillUpdate() {
    const { data = '', readOnly = false } = this.getRecord()
    const editor = this.codeMirrorEditor
    if (editor) {
      let doc = editor.getDoc()
      if (data !== doc.getValue()) {
        doc.setValue(data)
        doc.setCursor(doc.getCursor())
        editor.setOption('readOnly', readOnly)
      }
    }
  }

  render() {
    const { readOnly = false } = this.getRecord()
    return (
      <div className="lay-host">
        {readOnly && <Icon type="lock" className="host-readonly" />}
        <textarea ref={(ref => this.editor = ref)}></textarea>
      </div>
    )
  }
}

export default Hosts