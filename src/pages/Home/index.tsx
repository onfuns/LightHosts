import * as React from 'react'
import Menu from '../../components/Menu'
import Hosts from '../../components/Host'
import './style.less'

export default () => (
  <div className='lay-main-page'>
    <Menu />
    <Hosts />
  </div>
)
