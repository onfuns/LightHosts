import React, { Suspense, lazy } from 'react'
import { Spin } from 'antd'
import { renderRoutes } from 'react-router-config'

const HomePage = lazy(() => import('./pages/Home'))
const LazyHome = () => (
  <Suspense
    fallback={
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Spin />
      </div>
    }>
    <HomePage />
  </Suspense>
)

export default () => {
  const routes: any = [
    {
      path: '/',
      component: LazyHome
    }
  ]
  return renderRoutes(routes)
}
