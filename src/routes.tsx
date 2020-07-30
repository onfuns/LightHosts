import React from 'react'
import { renderRoutes } from 'react-router-config'
import Loadable from 'react-loadable'
import HomePage from './pages/Home'

const loading = ({ error, pastDelay }) => {
  if (error) {
    return <div>Error!</div>
  } else if (pastDelay) {
    return <div>Loading...</div>
  } else {
    return null
  }
}
const delay = 200
export default () => {
  const routes: any = [
    {
      path: '/',
      //exact: true,
      component: HomePage
      // component: Loadable({
      //   loader: () => import('./pages/Home'),
      //   loading,
      //   delay
      // })
    }
  ]
  return renderRoutes(routes)
}
