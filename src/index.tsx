import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import stores from './store'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import App from './app'

render(
  <ConfigProvider locale={zhCN}>
    <Provider {...stores}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
)
