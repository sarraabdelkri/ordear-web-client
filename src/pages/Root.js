import React from 'react'

import { Outlet } from 'react-router-dom/dist'
import Navs from '../components/Navs/Navs'

const Root = () => {
  return (
    <>

    <Outlet />
    
    </>
  )
}

export default Root