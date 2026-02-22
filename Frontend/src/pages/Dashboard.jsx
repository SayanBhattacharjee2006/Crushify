import React from 'react'
import { useAuthStore } from '../stores/auth.store'
import { Link } from 'react-router-dom';

function Dashboard() {
    const {user} = useAuthStore();
    console.log("user:",user)
    return (
    <div className='flex justify-center items-center h-screen'>
        <div>
            {
                user? <div>{user.fullname}</div>:<Link to="/login">Login</Link>
            }
        </div>
        
    </div>
  )
}

export default Dashboard