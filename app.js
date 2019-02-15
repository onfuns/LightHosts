import React from 'react'
import { HashRouter as RouterContainer } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import stores from './store'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import MainPage from './views/MainPage'

export default () => (
  <Provider {...stores}>
    <LocaleProvider locale={zh_CN}>
      <RouterContainer>
        <Route exact path="/" component={MainPage} />
      </RouterContainer>
    </LocaleProvider>
  </Provider>
)