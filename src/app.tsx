import React from 'react'
import { BrowserRouter as RouterContainer } from 'react-router-dom'
import RootRouter from './routes'
import './assets/css/common.less'

export default () => {
  return (
    <RouterContainer>
      <RootRouter />
    </RouterContainer>
  )
}
