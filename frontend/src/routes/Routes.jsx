import React from 'react'
import {Routes, Route} from 'react-router-dom'
import NotFound from '../components/404'
import App from '../App'


const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<App/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/home" element={<Home/>}></Route>

        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes