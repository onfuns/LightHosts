import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as RouterContainer } from 'react-router-dom'
import { Provider } from 'mobx-react'
import stores from './store'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import Routes from './routes'
import './assets/css/common.less'

const App = () => (
  <Provider {...stores}>
    <LocaleProvider locale={zh_CN}>
      <RouterContainer>
        <Routes />
      </RouterContainer>
    </LocaleProvider>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'))
