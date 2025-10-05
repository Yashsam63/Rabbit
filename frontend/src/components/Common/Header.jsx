import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header className='border-b border-gray-30'>
      {/* Topbar */}
      <Topbar/>
      {/* navbar */}
      <Navbar/>
      {/* Crat Drawer */}

    </header>
  )
}

export default Header
