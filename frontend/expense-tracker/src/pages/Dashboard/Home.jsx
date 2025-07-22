import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'

function Home() {
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        Home
      </div>
    </DashboardLayout>
  )
}

export default Home