import React from 'react'
import { Outlet } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard.jsx'
import ProfileTabs from '../components/ProfileTabs.jsx'
function ProfileLayout() {
  return (
    <div className='flex flex-col gap-4  w-full'>
        <ProfileCard/>
        <ProfileTabs/>
        <Outlet/>
    </div>
  )
}

export default ProfileLayout