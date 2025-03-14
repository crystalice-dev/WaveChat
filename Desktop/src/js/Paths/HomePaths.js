import React from 'react'
import { Routes, Route } from 'react-router-dom'

import DashboardView from '../Views/Dashboard/DashboardView'

function HomePaths() {
  return (
    <Routes>
      <Route path='/' element={<DashboardView />} />
    </Routes>
  )
}
 
export default HomePaths
